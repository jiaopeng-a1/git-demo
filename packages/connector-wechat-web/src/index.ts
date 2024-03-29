/**
 * The Implementation of OpenID Connect of WeChat Web Open Platform.
 * https://developers.weixin.qq.com/doc/oplatform/Website_App/WeChat_Login/Wechat_Login.html
 */

import {
  ConnectorMetadata,
  GetAuthorizationUri,
  GetUserInfo,
  ConnectorError,
  ConnectorErrorCodes,
  Connector,
  SocialConnectorInstance,
  GetConnectorConfig,
  codeDataGuard,
} from '@logto/connector-types';
import { assert } from '@silverhand/essentials';
import got, { HTTPError } from 'got';

import {
  authorizationEndpoint,
  accessTokenEndpoint,
  userInfoEndpoint,
  scope,
  defaultMetadata,
  defaultTimeout,
  invalidAccessTokenErrcode,
  invalidAuthCodeErrcode,
} from './constant';
import {
  wechatConfigGuard,
  accessTokenResponseGuard,
  GetAccessTokenErrorHandler,
  userInfoResponseGuard,
  GetUserInfoErrorHandler,
  WechatConfig,
} from './types';

export default class WechatConnector implements SocialConnectorInstance<WechatConfig> {
  public metadata: ConnectorMetadata = defaultMetadata;
  private _connector?: Connector;

  public get connector() {
    if (!this._connector) {
      throw new ConnectorError(ConnectorErrorCodes.General);
    }

    return this._connector;
  }

  public set connector(input: Connector) {
    this._connector = input;
  }

  constructor(public readonly getConfig: GetConnectorConfig) {}

  public validateConfig(config: unknown): asserts config is WechatConfig {
    const result = wechatConfigGuard.safeParse(config);

    if (!result.success) {
      throw new ConnectorError(ConnectorErrorCodes.InvalidConfig, result.error);
    }
  }

  public getAuthorizationUri: GetAuthorizationUri = async ({ state, redirectUri }) => {
    const config = await this.getConfig(this.metadata.id);

    this.validateConfig(config);

    const { appId } = config;

    const queryParameters = new URLSearchParams({
      appid: appId,
      redirect_uri: encodeURI(redirectUri), // The variable `redirectUri` should match {appId, appSecret}
      response_type: 'code',
      scope,
      state,
    });

    return `${authorizationEndpoint}?${queryParameters.toString()}`;
  };

  public getAccessToken = async (
    code: string
  ): Promise<{ accessToken: string; openid: string }> => {
    const config = await this.getConfig(this.metadata.id);

    this.validateConfig(config);

    const { appId: appid, appSecret: secret } = config;

    const httpResponse = await got.get(accessTokenEndpoint, {
      searchParams: { appid, secret, code, grant_type: 'authorization_code' },
      timeout: defaultTimeout,
    });

    const result = accessTokenResponseGuard.safeParse(JSON.parse(httpResponse.body));

    if (!result.success) {
      throw new ConnectorError(ConnectorErrorCodes.InvalidResponse, result.error.message);
    }

    const { access_token: accessToken, openid } = result.data;

    this.getAccessTokenErrorHandler(result.data);

    assert(accessToken && openid, new ConnectorError(ConnectorErrorCodes.InvalidResponse));

    return { accessToken, openid };
  };

  // eslint-disable-next-line complexity
  public getUserInfo: GetUserInfo = async (data) => {
    const { code } = await this.authorizationCallbackHandler(data);
    const { accessToken, openid } = await this.getAccessToken(code);

    try {
      const httpResponse = await got.get(userInfoEndpoint, {
        searchParams: { access_token: accessToken, openid },
        timeout: defaultTimeout,
      });

      const result = userInfoResponseGuard.safeParse(JSON.parse(httpResponse.body));

      if (!result.success) {
        throw new ConnectorError(ConnectorErrorCodes.InvalidResponse, result.error.message);
      }

      const { unionid, headimgurl, nickname } = result.data;

      // Response properties of user info can be separated into two groups: (1) {unionid, headimgurl, nickname}, (2) {errcode, errmsg}.
      // These two groups are mutually exclusive: if group (1) is not empty, group (2) should be empty and vice versa.
      // 'errmsg' and 'errcode' turn to non-empty values or empty values at the same time. Hence, if 'errmsg' is non-empty then 'errcode' should be non-empty.
      this.getUserInfoErrorHandler(result.data);

      return { id: unionid ?? openid, avatar: headimgurl, name: nickname };
    } catch (error: unknown) {
      if (error instanceof HTTPError) {
        const { statusCode, body: rawBody } = error.response;

        if (statusCode === 401) {
          throw new ConnectorError(ConnectorErrorCodes.SocialAccessTokenInvalid);
        }

        throw new ConnectorError(ConnectorErrorCodes.General, JSON.stringify(rawBody));
      }

      throw error;
    }
  };

  // See https://developers.weixin.qq.com/doc/oplatform/Return_codes/Return_code_descriptions_new.html
  private readonly getAccessTokenErrorHandler: GetAccessTokenErrorHandler = (accessToken) => {
    const { errcode, errmsg } = accessToken;

    if (errcode) {
      assert(
        !invalidAuthCodeErrcode.includes(errcode),
        new ConnectorError(ConnectorErrorCodes.SocialAuthCodeInvalid, errmsg)
      );

      throw new ConnectorError(ConnectorErrorCodes.General, { errorDescription: errmsg, errcode });
    }
  };

  private readonly getUserInfoErrorHandler: GetUserInfoErrorHandler = (userInfo) => {
    const { errcode, errmsg } = userInfo;

    if (errcode) {
      assert(
        !invalidAccessTokenErrcode.includes(errcode),
        new ConnectorError(ConnectorErrorCodes.SocialAccessTokenInvalid, errmsg)
      );

      throw new ConnectorError(ConnectorErrorCodes.General, { errorDescription: errmsg, errcode });
    }
  };

  private readonly authorizationCallbackHandler = async (parameterObject: unknown) => {
    const result = codeDataGuard.safeParse(parameterObject);

    if (!result.success) {
      throw new ConnectorError(ConnectorErrorCodes.General, JSON.stringify(parameterObject));
    }

    return result.data;
  };
}
