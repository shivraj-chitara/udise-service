export class CommonUtils {
  static getEmailIdRegexQuery(emailId: string) {
    //to ensure that special characters(+,-,...) are treated literally when used in the regular expression and match exactly
    const regexEmailId = emailId.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

    return { $regex: `^${regexEmailId}$`, $options: 'i' };
  }
}
