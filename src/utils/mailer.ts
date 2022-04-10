//validation işlemleri için fake smtp server kullanılması lazım. araştırdığım gerekli dökümantasyon
//https://stackoverflow.com/questions/27536122/how-do-i-connect-to-a-fake-smtp-server-using-loopback
//https://www.jambit.com/en/latest-info/toilet-papers/testing-email-exchange-with-fake-smtp-servers/
//daha sorna araştıracağım

import nodemailer, {SendMailOptions} from 'nodemailer';
import log from '../utils/logger';
import config from 'config';

/*
async function createTestCreds() {
    const creds = await nodemailer.createTestAccount();
    console.log("hello");
    console.log({ creds });
}

createTestCreds();
*/

const smtp = config.get<{
    user: string,
    pass: string,
    host: string,
    port: number,
    secure: boolean
}>('smtp')

const transporter = nodemailer.createTransport({
    ...smtp,
    auth: {user: smtp.user, pass: smtp.pass}
})

async function sendEmail(payload: SendMailOptions) {
    transporter.sendMail(payload, (err, info) => {
        if (err) {
            log.error(err);
            return;
        } 
        log.info(`info: ${nodemailer.getTestMessageUrl(info)}`);
    });

}
export default sendEmail;