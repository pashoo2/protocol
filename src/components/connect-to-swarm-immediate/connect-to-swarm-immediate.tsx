import React from 'react';

import { ConnectToSwarm } from '../connect-to-swarm/connect-to-swarm';
import {
  CONNECT_TO_SWARM_IMMEDIATE_CREDENTIALS_VARIANT,
  CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS,
} from './connect-to-swarm-immediate.const';

export class ConnectToSwarmImmediate extends React.Component {
  render() {
    return (
      <ConnectToSwarm
        connectImmediateWithCredentials={
          CONNECT_TO_SWARM_IMMEDIATE_CREDENTIALS_VARIANT
        }
        dbOptionsToConnectImmediate={
          CONNECT_TO_SWARM_IMMEDIATE_DATABASE_OPTIONS
        }
      />
    );
  }
}
