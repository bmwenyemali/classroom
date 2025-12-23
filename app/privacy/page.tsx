export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-8 md:p-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          Privacy Policy
        </h1>

        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-6">
            <strong>Last Updated:</strong> December 21, 2025
          </p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Classroom. We respect your privacy and are committed to
              protecting your personal data. This privacy policy explains how we
              collect, use, and safeguard your information when you use our
              educational management platform.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              2. Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.1 Information You Provide
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                password when you create an account
              </li>
              <li>
                <strong>Profile Information:</strong> User role (student,
                teacher, professor), profile picture via Google OAuth
              </li>
              <li>
                <strong>Educational Data:</strong> Course enrollments, grades,
                assignments, and academic records
              </li>
              <li>
                <strong>Communication Data:</strong> Messages, feedback, and
                support requests
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.2 Automatically Collected Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, time
                spent on the platform
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, operating
                system, IP address
              </li>
              <li>
                <strong>Cookies:</strong> Session cookies for authentication and
                functionality
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              2.3 Third-Party Information
            </h3>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Google OAuth:</strong> Email, name, and profile picture
                when you sign in with Google
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              3. How We Use Your Information
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use the collected information for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Service Provision:</strong> To provide, maintain, and
                improve Classroom features
              </li>
              <li>
                <strong>Account Management:</strong> To create and manage user
                accounts and roles
              </li>
              <li>
                <strong>Educational Functions:</strong> To manage courses,
                grades, assignments, and student progress
              </li>
              <li>
                <strong>Communication:</strong> To send important notifications,
                updates, and support messages
              </li>
              <li>
                <strong>Security:</strong> To detect, prevent, and address
                security issues and fraudulent activity
              </li>
              <li>
                <strong>Analytics:</strong> To understand usage patterns and
                improve user experience
              </li>
              <li>
                <strong>Compliance:</strong> To comply with legal obligations
                and enforce our terms
              </li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              4. Data Sharing and Disclosure
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4.1 Within the Platform
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              Your information is shared within Classroom based on your role:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Students:</strong> Can view their own grades and
                enrolled courses
              </li>
              <li>
                <strong>Teachers:</strong> Can view assigned courses and student
                grades in those courses
              </li>
              <li>
                <strong>Professors:</strong> Can view and manage all users,
                courses, and grades
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4.2 Third-Party Service Providers
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use trusted third-party services:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Supabase:</strong> For database hosting, authentication,
                and data storage
              </li>
              <li>
                <strong>Vercel:</strong> For application hosting and deployment
              </li>
              <li>
                <strong>Google OAuth:</strong> For authentication services
              </li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">
              4.3 Legal Requirements
            </h3>
            <p className="text-gray-700 leading-relaxed">
              We may disclose your information if required by law, court order,
              or to protect our rights and the safety of our users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We implement appropriate security measures to protect your data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Encryption:</strong> Data is encrypted in transit using
                HTTPS/TLS
              </li>
              <li>
                <strong>Authentication:</strong> Secure password hashing and
                OAuth 2.0
              </li>
              <li>
                <strong>Access Control:</strong> Role-based access control
                (RBAC) and Row Level Security (RLS)
              </li>
              <li>
                <strong>Regular Updates:</strong> We regularly update our
                security practices
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              However, no method of transmission over the internet is 100%
              secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              6. Data Retention
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We retain your personal data for as long as your account is active
              or as needed to provide services. Educational records (courses,
              grades, assignments) are retained according to institutional
              policies and legal requirements. You may request deletion of your
              account and associated data by contacting your institution's
              administrator.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              7. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Access:</strong> Request access to your personal data
              </li>
              <li>
                <strong>Correction:</strong> Request correction of inaccurate
                data
              </li>
              <li>
                <strong>Deletion:</strong> Request deletion of your account and
                data
              </li>
              <li>
                <strong>Export:</strong> Request a copy of your data in a
                portable format
              </li>
              <li>
                <strong>Restriction:</strong> Request restriction of processing
                in certain circumstances
              </li>
              <li>
                <strong>Objection:</strong> Object to processing of your data
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              To exercise these rights, please contact your institution's
              administrator or email us at privacy@classroom-app.com.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Classroom may be used by students under 13 years of age only with
              appropriate parental or guardian consent and under institutional
              supervision. We do not knowingly collect personal information from
              children under 13 without proper consent. If you believe we have
              collected such information, please contact us immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              9. International Data Transfers
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your data may be transferred to and processed in countries other
              than your own. We ensure appropriate safeguards are in place to
              protect your data in accordance with this privacy policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              10. Cookies and Tracking
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We use cookies for:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2">
              <li>
                <strong>Essential Cookies:</strong> Required for authentication
                and basic functionality
              </li>
              <li>
                <strong>Preference Cookies:</strong> To remember your settings
                and preferences
              </li>
              <li>
                <strong>Analytics Cookies:</strong> To understand how you use
                the platform
              </li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-3">
              You can manage cookie preferences through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              11. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We may update this privacy policy from time to time. We will
              notify you of any material changes by posting the new policy on
              this page and updating the "Last Updated" date. Your continued use
              of Classroom after changes constitutes acceptance of the updated
              policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              12. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you have any questions about this Privacy Policy or our data
              practices, please contact us:
              <br />
              <br />
              <strong>Email:</strong> privacy@classroom-app.com
              <br />
              <strong>Support:</strong> support@classroom-app.com
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              13. GDPR Compliance (for EU Users)
            </h2>
            <p className="text-gray-700 leading-relaxed">
              If you are located in the European Economic Area (EEA), you have
              additional rights under the General Data Protection Regulation
              (GDPR). We process your data based on:
            </p>
            <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-3">
              <li>
                <strong>Consent:</strong> When you sign up and use our services
              </li>
              <li>
                <strong>Contract:</strong> To fulfill our obligations under our
                Terms of Service
              </li>
              <li>
                <strong>Legitimate Interests:</strong> To improve and secure our
                services
              </li>
              <li>
                <strong>Legal Obligation:</strong> To comply with applicable
                laws
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <a
            href="/terms"
            className="text-blue-600 hover:text-blue-700 font-medium mr-6"
          >
            Terms of Service
          </a>
          <a href="/" className="text-gray-600 hover:text-gray-700 font-medium">
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}
