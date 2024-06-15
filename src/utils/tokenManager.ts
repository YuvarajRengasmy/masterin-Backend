import * as jwt from 'jsonwebtoken';
import { response } from '../helper/commonResponseHandler';
import { clientError, errorMessage } from '../helper/ErrorMessage';
const activity = 'token';

/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to token creation
 */

export let CreateJWTToken = (data: any = {}) => {
    let tokenData = {};
    if (data && data['name']) {
        tokenData['name'] = data['name']
    }
    if (data && data['loginType']) {
        tokenData['loginType'] = data['loginType']
    }
    if (data && data['id']) {
        tokenData['id'] = data['id']
    }
  
    const token = jwt.sign(tokenData, 'masterin', { expiresIn: '8h' });
    return token;
}



/**
 * @author Ponjothi S
 * @date 14-11-2023
 * @param {Object} req 
 * @param {Object} res 
 * @param {Function} next  
 * @description This Function is used to Chech the session and Verify the token
 */
export let checkSession = async (req, res, next) => {
    const token = req.headers['token'];
    if (token) {
        const headerType = token.split(' ')[0];
        const tokenValue = token.split(' ')[1].trim();
        if (headerType.trim() === "Bearer") {
            try {
                jwt.verify(tokenValue, 'masterin', function (err, tokendata) {
                    if (err) {
                        return res.status(401).json({ message: clientError.token.sessionExpire })
                    }
                    if (tokendata) {
                        console.log('tokendata',tokendata);
                        req.body.loginId = tokendata.id;
                        req.body.loginUserName = tokendata.name;
                        req.body.loginType = tokendata.loginType;
                        req.body.createdBy = tokendata.name;
                        req.body.createdOn = new Date();
                        req.body.modifiedBy = tokendata.name;
                        req.body.modifiedOn = new Date();
                        next();
                    }
                });
            } catch (err: any) {
                return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute, err.message);
            }
        }
    } else {
        return response(req, res, activity, 'Check-Session','Level-3',  false, 499, {}, clientError.token.unauthRoute);
    }
}
