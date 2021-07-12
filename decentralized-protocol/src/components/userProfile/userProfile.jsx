import React from 'react';
export class UserProfile extends React.PureComponent {
    render() {
        const { id, profile } = this.props;
        return (!!id && (<div>
          <p>Id: {id}</p>
          {(profile === null || profile === void 0 ? void 0 : profile.name) && <p>Name: {profile === null || profile === void 0 ? void 0 : profile.name}</p>}
          {(profile === null || profile === void 0 ? void 0 : profile.email) && <p>Email: {profile === null || profile === void 0 ? void 0 : profile.email}</p>}
          {(profile === null || profile === void 0 ? void 0 : profile.phone) && <p>Phone: {profile === null || profile === void 0 ? void 0 : profile.phone}</p>}
          {(profile === null || profile === void 0 ? void 0 : profile.photoURL) && <p>Photo: {profile === null || profile === void 0 ? void 0 : profile.photoURL}</p>}
        </div>));
    }
}
//# sourceMappingURL=userProfile.jsx.map