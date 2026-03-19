import aboutOne from "@/assets/images/about/Two.png"
import aboutTwo from "@/assets/images/about/One.png";
import aboutFive from "@/assets/images/about/Four.png";
import aboutThree from "@/assets/images/about/Three.png";
export default function About() {
  return (
    <main id="about-page">

      <section id="about-section" className="pt-5 light-black">
        <div className="container px-4">
          <h3 className="fs-32 fw-bold mb-4 pb-3 border-bottom border-dark d-inline-block">About AskMyNotes</h3>

          {/* Section 1 - Introduction */}
          <div className="row mb-lg-5 mb-4 align-items-center about-card">
            <div className="col-lg-7 order-1 order-lg-0">
              <div className="introduction pe-lg-4 mt-4 mt-lg-0">
                <h4 className="fs-24 fw-bold mb-3">Introduction</h4>
                <p className="fw-light text-justify fs-sm-15">
                  AskMyNotes is a student-centric academic platform crafted 
                  to simplify access to a vast and diverse range of educational 
                  materials. Designed for learners at every stage, we support 
                  students pursuing undergraduate (UG), postgraduate (PG), diploma, 
                  and polytechnic courses across various streams and disciplines.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  Our platform features a well-organized collection of 
                  high-quality notes, systematically categorized by stream, 
                  course, and semester, making it easier for students to find 
                  exactly what they need—whether they're preparing for exams, 
                  catching up on missed lectures, or revising key concepts. 
                  From science and engineering to commerce, arts, and professional 
                  courses, AskMyNotes aims to be your go-to academic companion throughout 
                  your educational journey.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  We’re committed to making learning accessible, collaborative,
                  and efficient for all students, regardless of their location
                  or institution.
                </p>
              </div>
            </div>
            <div className="col-lg-5 order-0 order-lg-1">
              <img src={aboutOne} alt="Image" className="img-fluid img-style" />
            </div>
          </div>

          {/* Section 2 - Mission */}
         <div className="row mb-lg-5 mb-4 align-items-center about-card">
            <div className="col-lg-5">
              <img src={aboutThree} alt="Image" className="img-fluid img-style" />
            </div>
            <div className="col-lg-7">
              <div className="mission ps-lg-4 pt-4 pt-lg-0">
                <h4 className="fs-24 fw-bold mb-3">Our Mission</h4>
                <p className="fw-light text-justify fs-sm-15">
                  Our mission is simple yet powerful — to empower students by
                  offering a centralized, community-driven platform for sharing
                  and accessing quality academic notes. At AskMyNotes, we
                  believe that collaborative learning, peer support, and open
                  access to educational content are the cornerstones of academic
                  excellence.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  By encouraging students to contribute their own notes and
                  benefit from others' experiences, we create a cycle of mutual
                  growth and knowledge-sharing. Our goal is to eliminate
                  barriers to learning and build a space where every student can
                  thrive — whether you're attending top-tier universities or
                  small-town colleges.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  We strive to foster a culture where students feel supported,
                  motivated, and equipped with the tools they need to succeed
                  academically and beyond.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3 - Who Can Use This? */}
          <div className="row mb-lg-5 mb-4 align-items-center about-card">
            <div className="col-lg-7 order-1 order-lg-0">
              <div className="who-can-use-this pe-lg-4 mt-4 mt-lg-0">
                <h4 className="fs-24 fw-bold mb-3">Who Can Use This?</h4>
                <p className="fw-light text-justify fs-sm-15">
                  AskMyNotes is built with inclusivity at its core — a
                  platform thoughtfully designed for students from all walks of
                  academic life. Whether you're a science enthusiast
                  experimenting with theories, a commerce student navigating
                  financial models, an arts major exploring human expression, or
                  an engineering mind decoding systems and circuits, you'll find
                  a wealth of resources crafted for your academic growth.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  It doesn't stop there — from undergraduates and postgraduates
                  to diploma holders, polytechnic students, and even open
                  university learners, AskMyNotes offers curated academic
                  support tailored to your stream, course, and semester. Whether
                  you're diving into physics, chemistry, mathematics, computer
                  science, economics, business studies, law, literature,
                  psychology, management, social sciences, or emerging
                  interdisciplinary fields, there's always something relevant
                  and reliable waiting for you.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  Our mission is to ensure that no student ever feels left
                  behind. Regardless of your academic level, institution, or
                  specialization, AskMyNotes is your academic companion,
                  helping you learn better, faster, and more efficiently.
                </p>
                <p className="fw-light text-justify fs-sm-15">
                  We’re building a platform where every student—regardless of
                  stream, background, year of study, or language preference—can
                  belong and thrive.
                </p>
              </div>
            </div>
            <div className="col-lg-5 order-0 order-lg-1">
              <img src={aboutTwo} alt="Image" className="img-fluid img-style" />
            </div>
          </div>

          {/* Section 4 - Features & Goals Grid */}
          <div className="row mb-lg-5 mb-4 g-4">
            <div className="col-lg-6">
              <div className="key-features h-100 about-card">
                <h4 className="fs-24 fw-bold mb-3">Key Features</h4>
                <ul className="ps-3">
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Stream-wise categorization of notes for easy navigation</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Upload and download notes anytime, anywhere</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Smart search and filters to quickly find relevant materials</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Built by students, for students - we understand your needs</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="future-goals h-100 about-card">
                <h4 className="fs-24 fw-bold mb-3">Future Goals</h4>
                <ul className="ps-3">
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Add verified notes from faculty members</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Enable discussions and peer reviews for notes</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Support for MCQs, assignments, and other study materials</li>
                  <li className="mb-2 fw-light fs-sm-15 text-secondary">Develop a mobile app for on-the-go access</li>
                </ul>
              </div>
            </div>
          </div>

   {/* Section 5 - Get Involved */}
            <div className="row mb-lg-5 mb-4 align-items-center about-card">
            <div className="col-lg-7 order-1 order-lg-0">
               <h4 className="fs-24 fw-bold mb-3">Get Involved</h4>
                <p className="fw-light text-justify fs-sm-15">
                  Join our community to collaborate, upload your own notes, 
                  and benefit from the experiences of your peers. 
                  By participating in discussions and contributing your materials,
                   you help us create a space where every student has the tools they need to succeed. 
                   Register today to get started and help us strengthen the AskMyNotes network for students across all disciplines.
                </p>
            </div>
             <div className="col-lg-5 order-0 order-lg-1">
              <img src={aboutFive} alt="Image" className="img-fluid img-style" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}