import React from 'react';
import { ICentralAuthorityUserProfile } from '../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-common';

type TUserProfileComponentProps = {
  id: string | undefined;
  profile: ICentralAuthorityUserProfile | undefined;
};

export class UserProfile extends React.PureComponent<
  TUserProfileComponentProps
> {
  render() {
    const { id, profile } = this.props;
    return (
      !!id && (
        <div>
          <p>Id: {id}</p>
          {profile?.name && <p>Name: {profile?.name}</p>}
          {profile?.email && <p>Email: {profile?.email}</p>}
          {profile?.phone && <p>Phone: {profile?.phone}</p>}
          {profile?.photoURL && <p>Photo: {profile?.photoURL}</p>}
        </div>
      )
    );
  }
}
