// services/mailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Vérifier la configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Erreur configuration email:', error);
  } else {
    console.log('✅ Service email prêt à envoyer des messages');
  }
});

// Formater la date en français
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('fr-FR', options);
};

// Email d'acceptation
const sendAcceptanceEmail = async (email, prenom, nom, titre, dateEvenement, lieu) => {
  try {
    console.log('📧 Envoi email d\'acceptation à:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `✅ Votre inscription a été acceptée - ${titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">✅ Inscription Acceptée</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">
              Nous avons le plaisir de vous confirmer que votre inscription à l'événement suivant a été <strong style="color: #667eea;">acceptée</strong> :
            </p>
            
            <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #333;">${titre}</h3>
              <p style="margin: 10px 0;"><strong>📅 Date :</strong> ${formatDate(dateEvenement)}</p>
              <p style="margin: 10px 0;"><strong>📍 Lieu :</strong> ${lieu}</p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Nous vous remercions de votre participation et nous nous réjouissons de vous voir à cet événement !
            </p>
            
            <p style="color: #555;">
              Si vous avez des questions, n'hésitez pas à nous contacter.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Evenia - Plateforme de Gestion d'Événements
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email d\'acceptation envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email acceptation:', error);
    throw error;
  }
};

// Email de refus
const sendRejectionEmail = async (email, prenom, nom, titre, raison) => {
  try {
    console.log('📧 Envoi email de refus à:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `❌ Votre inscription a été refusée - ${titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">❌ Inscription Refusée</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">
              Nous regrettons de vous informer que votre inscription à l'événement suivant a été <strong style="color: #f5576c;">refusée</strong> :
            </p>
            
            <div style="background: white; border-left: 4px solid #f5576c; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #333;">${titre}</h3>
              ${raison ? `<p style="margin: 10px 0;"><strong>Raison :</strong> ${raison}</p>` : ''}
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Nous vous encourageons à consulter d'autres événements disponibles sur notre plateforme.
            </p>
            
            <p style="color: #555;">
              Si vous avez des questions concernant cette décision, n'hésitez pas à nous contacter.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Evenia - Plateforme de Gestion d'Événements
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de refus envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email refus:', error);
    throw error;
  }
};

// Email de confirmation d'inscription initiale
const sendRegistrationConfirmationEmail = async (email, prenom, nom, titre, code) => {
  try {
    console.log('📧 Envoi email de confirmation d\'inscription à:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `📋 Inscription à l'événement reçue - ${titre}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">📋 Inscription Reçue</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">
              Votre inscription à l'événement a bien été reçue. Nous examinons votre demande et vous confirmerons sa validation très bientôt.
            </p>
            
            <div style="background: white; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #333;">En attente de validation</h3>
              <p style="margin: 10px 0;"><strong>Événement :</strong> ${titre}</p>
              <p style="margin: 10px 0;"><strong>Code :</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${code}</code></p>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
              Vous recevrez un email de confirmation dès que votre inscription aura été validée par nos équipes.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Evenia - Plateforme de Gestion d'Événements
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmation d\'inscription envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email confirmation:', error);
    throw error;
  }
};

// Email de rappel 72h avant l'événement
const sendEventReminderEmail = async (email, prenom, nom, titre, dateEvenement, lieu, description, code) => {
  try {
    console.log('📧 Envoi email de rappel à:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `🔔 Rappel : Votre événement "${titre}" dans 3 jours !`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: white; margin: 0;">🔔 Rappel d'Événement</h1>
          </div>
          
          <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px;">
            <p style="color: #333; font-size: 16px;">Bonjour <strong>${prenom} ${nom}</strong>,</p>
            
            <p style="color: #555; line-height: 1.6;">
              Ceci est un rappel amical : l'événement auquel vous êtes inscrit aura lieu dans <strong style="color: #4facfe;">3 jours</strong> !
            </p>
            
            <div style="background: white; border-left: 4px solid #4facfe; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h3 style="margin-top: 0; color: #333;">📅 ${titre}</h3>
              <p style="margin: 10px 0;"><strong>🕐 Date :</strong> ${formatDate(dateEvenement)}</p>
              <p style="margin: 10px 0;"><strong>📍 Lieu :</strong> ${lieu}</p>
              <p style="margin: 10px 0;"><strong>🎫 Code :</strong> <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${code}</code></p>
              ${description ? `<p style="margin: 10px 0;"><strong>📝 Description :</strong> ${description}</p>` : ''}
            </div>
            
            <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>⏰ Préparez-vous !</strong><br>
                N'oubliez pas de noter la date et l'heure dans votre agenda.
              </p>
            </div>
            
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h3 style="color: white; margin: 0 0 10px 0;">Nous avons hâte de vous voir !</h3>
              <p style="color: white; margin: 0; font-size: 14px;">L'équipe Evenia</p>
            </div>
            
            <p style="color: #555; font-size: 14px; line-height: 1.6;">
              Si vous avez des questions ou besoin d'informations supplémentaires, n'hésitez pas à nous contacter.
            </p>
            
            <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
            
            <p style="color: #999; font-size: 12px; text-align: center;">
              © 2025 Evenia - Plateforme de Gestion d'Événements<br>
              Cet email est un rappel automatique envoyé 72 heures avant votre événement.
            </p>
          </div>
        </div>
      `
    };
    
    await transporter.sendMail(mailOptions);
    console.log('✅ Email de rappel envoyé à:', email);
    return true;
  } catch (error) {
    console.error('❌ Erreur envoi email rappel:', error);
    throw error;
  }
};

module.exports = {
  sendAcceptanceEmail,
  sendRejectionEmail,
  sendRegistrationConfirmationEmail,
  sendEventReminderEmail
};