import React from 'react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      
      <div className="space-y-6 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold mb-3">1. Introduction</h2>
          <p>
            Welcome to ISO Hub. We respect your privacy and are committed to protecting your personal data. 
            This privacy policy will inform you about how we look after your personal data when you use our ISO Hub platform 
            and tell you about your privacy rights and how the law protects you.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">2. Information We Collect</h2>
          <p>We collect and process the following types of personal data:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Account Information (name, email address, password)</li>
            <li>User Role and Permissions Data</li>
            <li>Team Member Information (for team collaboration features)</li>
            <li>Vendor Information (for vendor management)</li>
            <li>Document and File Data (including files uploaded to our platform)</li>
            <li>Cloud Storage Integration Data (Google Drive, Dropbox, OneDrive)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">3. How We Use Your Information</h2>
          <p>We use your personal data for the following purposes:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>To provide and maintain our ISO Hub platform</li>
            <li>To manage user accounts and permissions</li>
            <li>To handle document management and file sharing</li>
            <li>To process form submissions and applications</li>
            <li>To facilitate cloud storage integrations</li>
            <li>To send important notifications about our service</li>
            <li>To provide customer support</li>
            <li>To monitor and improve our platform's performance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">4. Third-Party Integrations</h2>
          <p>Our platform integrates with the following third-party services:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Google Drive - for file storage and management</li>
            <li>Dropbox - for file storage and management</li>
            <li>OneDrive - for file storage and management</li>
          </ul>
          <p className="mt-2">
            When you use these integrations, we may share certain information with these services. 
            Each service has its own privacy policy, and we encourage you to review them.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">5. Data Security</h2>
          <p>
            We implement appropriate security measures to protect your personal data, including:
          </p>
          <ul className="list-disc ml-6 mt-2">
            <li>Secure authentication</li>
            <li>Encrypted data transmission using HTTPS</li>
            <li>Role-based access control for sensitive data</li>
            <li>Regular security assessments and updates</li>
            <li>Secure file storage and transfer protocols</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">6. Your Legal Rights</h2>
          <p>Under data protection laws, you have the following rights:</p>
          <ul className="list-disc ml-6 mt-2">
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Request data portability</li>
            <li>Withdraw consent</li>
            <li>Lodge a complaint with supervisory authorities</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-3">7. Data Retention</h2>
          <p>
            We retain your personal data for as long as necessary to provide our services and comply with legal obligations. 
            When we no longer need your data, we will securely delete or anonymize it.
          </p>
        </section>

        {/* <section>
          <h2 className="text-2xl font-semibold mb-3">8. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy or our data practices, please contact us at:
            <br />
            Email: privacy@isohub.com
          </p>
        </section> */}

        <section>
          <h2 className="text-2xl font-semibold mb-3">9. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy 
            on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </section>

        <div className="mt-8 text-sm text-gray-500">
          Last Updated: 5/9/2025
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy; 