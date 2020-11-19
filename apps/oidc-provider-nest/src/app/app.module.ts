import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Account,
  AccessToken,
  AuthorizationCode,
  Client,
  ClientCredential,
  DeviceCode,
  InitialAccessToken,
  Interaction,
  RefreshToken,
  RegistrationAccessToken,
  Session,
  User,
  InteractionModule,
  UserModule,
  ClientMetadataModule,
  ClientMetadata,
  GrantType,
  ClientMetadataRepo,
  RedirectUriRepo,
  ResponseTypeRepo,
  GrantTypeRepo,
  RedirectUri,
  ResponseType,
  TokenEndpointAuthMethod,
  TokenEndpointAuthMethodRepo,
  Role,
  RoleModule,
  UserRole,
  UserLogin,
  UserLoginModule,
  SecretQuestion,
  SecretAnswer,
  UserPasswordReset,
  UserPasswordHistory,
  PushedAuthorizationRequest,
  ReplayDetection
} from '@tamu-gisc/oidc/provider-nestjs';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dbConfig } from '../environments/environment';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...dbConfig,
      entities: [
        TokenEndpointAuthMethod,
        Account,
        AccessToken,
        AuthorizationCode,
        Client,
        ClientCredential,
        ClientMetadata,
        DeviceCode,
        GrantType,
        InitialAccessToken,
        Interaction,
        RedirectUri,
        RefreshToken,
        RegistrationAccessToken,
        ResponseType,
        Role,
        Session,
        User,
        UserRole,
        UserLogin,
        SecretQuestion,
        SecretAnswer,
        UserPasswordReset,
        UserPasswordHistory,
        PushedAuthorizationRequest,
        ReplayDetection
      ]
    }),
    // TODO: Is this .forFeature here required since it's in ClientMetadataModule?
    TypeOrmModule.forFeature([
      ClientMetadataRepo,
      GrantTypeRepo,
      RedirectUriRepo,
      ResponseTypeRepo,
      TokenEndpointAuthMethodRepo
    ]),
    // AuthModule,
    InteractionModule,
    ClientMetadataModule,
    RoleModule,
    UserModule,
    UserLoginModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {
  constructor() {}
}
