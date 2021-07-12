export declare const CA_VALIDATORS_USER_PROFILE_SCHEME: {
    $id: string;
    type: string;
    additionalProperties: boolean;
    required: any[];
    properties: {
        name: {
            oneOf: {
                type: string;
            }[];
        };
        email: {
            oneOf: {
                type: string;
            }[];
        };
        phone: {
            type: string;
            pattern: string;
        };
        photoURL: {
            oneOf: {
                type: string;
            }[];
        };
    };
};
//# sourceMappingURL=central-authority-validators-user.schemes.d.ts.map