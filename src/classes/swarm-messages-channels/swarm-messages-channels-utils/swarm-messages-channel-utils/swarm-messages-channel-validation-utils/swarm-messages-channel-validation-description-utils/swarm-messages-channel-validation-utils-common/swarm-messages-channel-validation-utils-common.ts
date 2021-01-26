/**
 * Validates users identities sequently.
 * Because any of user id can be invalid
 * we should avoid checking of all the identities
 * at once to keep the bandwidth.
 *
 * @param {string[]} usersIdsList
 * @param {(userId: string) => Promise<boolean>} isValidUserId
 * @returns {Promise<void>}
 */
export const validateUsersList = async (
  usersIdsList: string[],
  isValidUserId: (userId: string) => Promise<boolean>
): Promise<void> => {
  let currentlyValidatingUserIdentity;
  let currentlyValidatingUserIdx = 0;
  while ((currentlyValidatingUserIdentity = usersIdsList[currentlyValidatingUserIdx])) {
    if (!(await isValidUserId(currentlyValidatingUserIdentity))) {
      throw new Error(`The user idenity is not valid: ${currentlyValidatingUserIdentity}`);
    }
    currentlyValidatingUserIdx += 1;
  }
};
