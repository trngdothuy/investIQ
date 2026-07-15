import { createFileRoute } from '@tanstack/react-router'
import QuestionnaireLayout from '../components/questionnaireLayout'

export const Route = createFileRoute('/about')({
  component: About,
})

const teamMembers = [
  {
    name: 'Trang Do Thuy',
    role: 'Team Lead & Fullstack Developer',
    title: 'The Swiss Army Knife',
    image: '/images/team/trang.png',
    description:
      'Connected all the pieces by tackling full-stack development, reviewing pull requests, handling deployments, coordinating the team, and filling in wherever help was needed.',
  },
  {
    name: 'Jannah Pitogo',
    role: 'Web Developer',
    title: 'The Solution Guru',
    image: '/images/team/jannah.jpg',
    description:
      "Powered the backend with the application's core logic, hunted down bugs through back-end testing and QA, enhanced the UX and kept our presentation looking sharp.",
  },
  {
    name: 'Diksha Aggarwal',
    role: 'Web Developer',
    title: 'The Quality Detective',
    image: '/images/team/diksha.jpg',
    description:
      'Owned the front-end testing and quality assurance, built the first version of the landing page, and laid the first bricks of the dashboard, setting a foundation for what came next.',
  },
  {
    name: 'Ifeoma Osegbo',
    role: 'Web Developer',
    title: 'The Frontend Design Wizard',
    image: '/images/team/ifeoma.PNG',
    description:
      'Brought the frontend to life with a user-focused and business-minded design approach, crafted the navigation experience and became the go-to expert for the questionnaire page.',
  },
]

function About() {
  return (
    <QuestionnaireLayout>
      <main className="about-page">
        <div className="about-card">
          {/* Hero */}
          <section className="about-hero">
            <div className="about-badge">About InvestIQ</div>

            <h1>Built to help beginner investors make more informed decisions.</h1>

            <p>
              InvestIQ is an educational web application that helps retail investors understand
              portfolio diversification, investment risk, and environmental and social
              considerations through interactive learning and personalized insights.
            </p>
          </section>

          {/* Team */}
          <section className="about-section">
            <div className="team-photo-content">
              <h3>Meet the InvestIQ Team</h3>

              <p>
                The team behind InvestIQ during the Migracode capstone project, collaborating to
                build a platform that helps beginner investors make more informed investment
                decisions.
              </p>
            </div>

            <div className="team-photo-card">
              <img
                src="/images/team/team.jpg"
                alt="InvestIQ project team"
                className="team-group-photo"
              />

              <p className="team-photo-caption">
                The InvestIQ team during the Migracode capstone project.
              </p>
            </div>

            <div className="team-grid">
              {teamMembers.map((member) => (
                <div className="team-card" key={member.name}>
                  <img src={member.image} alt={member.name} className="team-member-photo" />

                  <h3>{member.name}</h3>

                  <p className="team-role">{member.role}</p>

                  <p className="team-title">{member.title}</p>

                  <p className="team-description">{member.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Leadership */}
          <section className="about-section">
            <h2>Project Leadership</h2>

            <div className="leadership-grid">
              <div className="leader-card">
                <h3>Product Owner</h3>

                <h4>- Yassine Y.</h4>

                <p>
                  Product owner responsible for guiding the project vision, defining requirements,
                  and supporting the development team.
                </p>
              </div>

              <div className="leader-card">
                <h3>Volunteer Technical Lead</h3>

                <h4>- John Cowie</h4>

                <p>
                  Provided technical mentorship, code reviews, and development guidance throughout
                  the project.
                </p>
              </div>
            </div>
          </section>

          {/* Acknowledgements */}
          <section className="about-section">
            <h2>Acknowledgements</h2>

            <div className="about-message">
              <h3>Migracode Barcelona</h3>

              <p>
                InvestIQ was developed as part of the Migracode Software Development Program. We are
                grateful to the mentors, volunteers, and the entire Migracode community for their
                continuous support and encouragement throughout this project.
              </p>
            </div>
          </section>

          {/* Footer */}
          <div className="about-footer">
            <button type="button" className="page-back-btn" onClick={() => window.history.back()}>
              ← Back
            </button>
          </div>
        </div>
      </main>
    </QuestionnaireLayout>
  )
}
