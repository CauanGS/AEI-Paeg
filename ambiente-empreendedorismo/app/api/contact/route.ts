import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    let transporter;

    // Verifica se está usando configuração de exemplo ou se não está configurado
    // Se sim, cria uma conta de teste no Ethereal Email]
    // Deve ser usado apenas em ambiente de desenvolvimento
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('example.com')) {
      console.log('⚠️ Usando conta de teste Ethereal (Ambiente de Desenvolvimento)');
      const testAccount = await nodemailer.createTestAccount();

      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } else {
      // Configuração de produção
      // Certifique-se de definir as variáveis de ambiente (.env) corretamente
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }

    const mailOptions = {
      from: process.env.SMTP_FROM,
      to: process.env.CONTACT_EMAIL,
      replyTo: email,
      subject: `[Contato Site] ${subject}`,
      text: `
        Você recebeu uma nova mensagem de contato pelo site.

        Nome: ${name}
        Email: ${email}
        Assunto: ${subject}
        
        Mensagem:
        ${message}
      `,
      html: `
        <h3>Nova mensagem de contato</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Assunto:</strong> ${subject}</p>
        <br/>
        <p><strong>Mensagem:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    // Se estiver usando Ethereal, publica a URL de visualização do email no console
    if (!process.env.SMTP_HOST || process.env.SMTP_HOST.includes('example.com')) {
      console.log('📧 Preview URL do Email:', nodemailer.getTestMessageUrl(info));
    }

    return NextResponse.json({ message: 'Email enviado com sucesso!' }, { status: 200 });
  } catch (error) {
    console.error('Erro ao enviar email:', error);
    return NextResponse.json({ error: 'Erro ao enviar email.' }, { status: 500 });
  }
}
