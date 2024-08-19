import LibGenerateTestUserSig from './lib-generate-test-usersig-es.min';

/**
 * SDKAppID, which should be replaced with user's SDKAppID.
 * Enter TRTC [Console] (https://console.trtc.io/) to create an application,
 * and you will see the SDKAppID.
 * It is a unique identifier used by to identify users.
 */
const SDKAppID = 0;


/**
 * Signature expiration time, which should not be too short
 * Time unit: second
 * Default time: 7 * 24 * 60 * 60 = 604800 = 7days
 */
const EXPIRETIME = 604800;

/**
 * Encryption key for calculating signature, which can be obtained in the following steps:
 *
 * Step1. Enter TRTC [Console](https://console.trtc.io/),
 * and create an application if you don't have one.
 * Step2. Click your application to find "Application Overview".
 * Step3. Click "SDKSecretKey" to see the encryption key for calculating UserSig,
 * and copy it to the following variable.
 *
 * Notes: this method is only applicable for debugging Demo. Before official launch,
 * please migrate the UserSig calculation code and key to your backend server to avoid
 * unauthorized traffic use caused by the leakage of encryption key.
 * Document: https://trtc.io/document/34385?product=chat&menulabel=serverapis
 */
const SECRETKEY = '';

/**
 * Module: GenerateTestUserSig
 *
 * Description: Generates UserSig for testing. UserSig is a security signature designed by TRTC for its cloud services.
 * It is calculated based on `SDKAppID`, `UserID`, and `EXPIRETIME` using the HMAC-SHA256 encryption algorithm.
 *
 * Attention: For the following reasons, do not use the code below in your commercial application.
 *
 * The code may be able to calculate UserSig correctly, but it is only for quick testing of the SDK’s basic features, not for commercial applications.
 * `SECRETKEY` in client code can be easily decompiled and reversed, especially on web.
 * Once your key is disclosed, attackers will be able to steal your TRTC traffic.
 *
 * The correct method is to deploy the `UserSig` calculation code and encryption key on your project server so that your application can request from your server a `UserSig` that is calculated whenever one is needed.
 * Given that it is more difficult to hack a server than a client application, server-end calculation can better protect your key.
 *
 * Reference: https://trtc.io/document/34385?product=chat&menulabel=serverapis
 */
function genTestUserSig(userID) {
  const generator = new LibGenerateTestUserSig(SDKAppID, SECRETKEY, EXPIRETIME);
  const userSig = generator.genTestUserSig(userID);

  return { SDKAppID, userSig };
}

export default genTestUserSig;

export {
  genTestUserSig,
  SDKAppID,
  EXPIRETIME,
};
