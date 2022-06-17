//validation işlemleri için fake smtp server kullanılması lazım. araştırdığım gerekli dökümantasyon
//https://stackoverflow.com/questions/27536122/how-do-i-connect-to-a-fake-smtp-server-using-loopback
//https://www.jambit.com/en/latest-info/toilet-papers/testing-email-exchange-with-fake-smtp-servers/
//daha sorna araştıracağım



import nodemailer, {SendMailOptions} from 'nodemailer';
import log from '../utils/logger';
import config from 'config';


async function createTestCreds() {
    const creds = await nodemailer.createTestAccount();
    console.log("hello");
    console.log({ creds });
}

createTestCreds();
 // burada bir tane daha olacak uynutma test creds kapalı, çünkü yeni user döndürüyor

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

/*
import Mailgun from 'mailgun-js';

async function sendEmail(data: {
    from: string,
    to: string,
    subject: string,
    text: string
    }) {
    const DOMAIN = "sandboxa1ffa927368a4d8eb6f1e9b05de4d598.mailgun.org";
    const mg = Mailgun({
    apiKey: "38b57d9508e0c168feb1bd0459300c09-162d1f80-2c213e62",
    domain: DOMAIN
});

mg.messages().send(data, function (error, body) {
	console.log(body);
});
}
export default sendEmail;
*/

/*
import Mailgun from 'mailgun-js';

    const DOMAIN = "sandboxa1ffa927368a4d8eb6f1e9b05de4d598.mailgun.org";
        const mg = Mailgun({
	    apiKey: "38b57d9508e0c168feb1bd0459300c09-162d1f80-2c213e62",
	    domain: DOMAIN
    });
    const data = {
	    from: "Mailgun Sandbox <postmaster@sandboxa1ffa927368a4d8eb6f1e9b05de4d598.mailgun.org>",
	    to: "cybptest@gmail.com",
	    subject: "Hello",
	    text: "Abi merhaba, mailgun importunu başarılı şekilde yaptım sadece adamların npm pkaetlerinde bazı sıkıntılar var onların ayarlanmasını yapmaya çalışıyorum. ablama selamlar"
    };
mg.messages().send(data, function (error, body) {
	console.log(body);
});
*/




