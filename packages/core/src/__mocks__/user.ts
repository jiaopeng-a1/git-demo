import { User, userInfoSelectFields } from '@logto/schemas';
import pick from 'lodash.pick';

export const mockUser: User = {
  id: 'foo',
  username: 'foo',
  primaryEmail: 'foo@logto.io',
  primaryPhone: '111111',
  roleNames: ['admin'],
  passwordEncrypted: null,
  passwordEncryptionMethod: null,
  name: null,
  avatar: null,
  identities: {
    connector1: { userId: 'connector1', details: {} },
  },
  customData: {},
  applicationId: 'bar',
  lastSignInAt: 1_650_969_465_789,
};

export const mockUserResponse = pick(mockUser, ...userInfoSelectFields);

export const mockUserList: User[] = [
  {
    id: '1',
    username: 'foo1',
    primaryEmail: 'foo1@logto.io',
    primaryPhone: '111111',
    roleNames: ['admin'],
    passwordEncrypted: null,
    passwordEncryptionMethod: null,
    name: null,
    avatar: null,
    identities: {},
    customData: {},
    applicationId: 'bar',
    lastSignInAt: 1_650_969_465_000,
  },
  {
    id: '2',
    username: 'foo2',
    primaryEmail: 'foo2@logto.io',
    primaryPhone: '111111',
    roleNames: ['admin'],
    passwordEncrypted: null,
    passwordEncryptionMethod: null,
    name: null,
    avatar: null,
    identities: {},
    customData: {},
    applicationId: 'bar',
    lastSignInAt: 1_650_969_465_000,
  },
  {
    id: '3',
    username: 'foo3',
    primaryEmail: 'foo3@logto.io',
    primaryPhone: '111111',
    roleNames: ['admin'],
    passwordEncrypted: null,
    passwordEncryptionMethod: null,
    name: null,
    avatar: null,
    identities: {},
    customData: {},
    applicationId: 'bar',
    lastSignInAt: 1_650_969_465_000,
  },
  {
    id: '4',
    username: 'bar1',
    primaryEmail: 'bar1@logto.io',
    primaryPhone: '111111',
    roleNames: ['admin'],
    passwordEncrypted: null,
    passwordEncryptionMethod: null,
    name: null,
    avatar: null,
    identities: {},
    customData: {},
    applicationId: 'bar',
    lastSignInAt: 1_650_969_465_000,
  },
  {
    id: '5',
    username: 'bar2',
    primaryEmail: 'bar2@logto.io',
    primaryPhone: '111111',
    roleNames: ['admin'],
    passwordEncrypted: null,
    passwordEncryptionMethod: null,
    name: null,
    avatar: null,
    identities: {},
    customData: {},
    applicationId: 'bar',
    lastSignInAt: 1_650_969_465_000,
  },
];

export const mockUserListResponse = mockUserList.map((user) => pick(user, ...userInfoSelectFields));