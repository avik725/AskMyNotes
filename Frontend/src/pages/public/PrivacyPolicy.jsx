import { Footer, Header } from "@/components";

export default function PrivacyPolicy() {
  return (
    <main id="privacy-policy-page">

      {/* Privacy Policy Section Starts */}
      <section id="privacy-policy-section" className="pt-5 pb-4">
        <div className="container px-4">
          <h3 className="fs-34 fw-bold mb-4 pb-3">Privacy Policy</h3>
          <div className="introduction mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">Introduction</h4>
            <p className="fw-light text-justify fs-sm-15">
              Welcome to AskMyNotes's Privacy Policy. This policy outlines
              how we collect, use, and protect your personal information when
              you use our platform. By using AskMyNotes, you agree to the
              terms of this policy. We are committed to protecting your privacy
              and ensuring the security of your data.
            </p>
          </div>
          <div className="data-collection mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">Date Collection</h4>
            <p className="fw-light text-justify fs-sm-15">
              We collect various types of information to provide and improve our
              services. This includes information you provide directly, such as
              your name, email address, and profile details. We also collect
              data automatically, such as your IP address, device information,
              and usage patterns on the platform. Additionally, we may collect
              information from third-party sources, such as social media
              platforms, if you choose to link your accounts.
            </p>
          </div>
          <div className="data-usage mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">Date Usage</h4>
            <p className="fw-light text-justify fs-sm-15">
              The information we collect is used for several purposes.
              Primarily, it helps us to personalize your experience, provide
              relevant content, and improve our services. We use your data to
              communicate with you, respond to inquiries, and send important
              updates. Additionally, we may use your information for research
              and analytics to understand user behavior and trends.
            </p>
          </div>
          <div className="data-protection mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">Date Protection</h4>
            <p className="fw-light text-justify fs-sm-15">
              We take the security of your data seriously and implement various
              measures to protect it. This includes using encryption, access
              controls, and regular security audits. However, no method of
              transmission over the internet or electronic storage is completely
              secure, and we cannot guarantee absolute security. We encourage
              you to use strong passwords and keep your account information
              confidential.
            </p>
          </div>
          <div className="user-rights mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">User Rights</h4>
            <p className="fw-light text-justify fs-sm-15">
              You have certain rights regarding your personal information. You
              can access, update, or delete your data through your account
              settings. You also have the right to object to or restrict certain
              processing of your data. If you have any questions or concerns
              about your rights, please contact us. We are committed to
              addressing your requests promptly and transparently.
            </p>
          </div>
          <div className="changes-to-the-policy mb-4">
            <h4 className="fs-22 fs-sm-20 fw-bold mb-3">Changes to This Policy</h4>
            <p className="fw-light text-justify fs-sm-15">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any significant changes by posting the updated policy on our
              platform and, if necessary, through other means of communication.
              Please review this policy periodically to stay informed about how
              we protect your information.
            </p>
          </div>
        </div>
      </section>
      {/* Privacy Policy Section Ends */}
    </main>
  );
}
