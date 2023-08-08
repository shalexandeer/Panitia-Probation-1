# Fundify: Empowering SMEs with Funding, Consultation, and Collaboration

Welcome to Fundify, a dynamic platform dedicated to Small and Medium-sized Enterprises (SMEs) seeking funding opportunities, expert business consultation, and collaborative learning. Our goal is to empower SMEs with the resources they need to thrive and grow in today's competitive business landscape.

## About Fundify

Fundify is more than just a funding platform; it's a comprehensive ecosystem designed to support SMEs from inception to expansion. We understand the unique challenges that SMEs face, and that's why we offer a holistic approach combining funding access, expert consultation, and collaborative learning.

## Figma Link
https://www.figma.com/file/K7eEheKZ2zOVICeGWp3Z1A/UI?type=design&node-id=0%3A1&mode=design&t=pEmJuVQQjKmjMlw9-1


### Key Features

- **Funding Opportunities**: Discover a variety of funding options tailored to your business needs. We connect SMEs with investors, venture capitalists, and crowdfunding opportunities to fuel growth and innovation.

- **Expert Consultation**: Access seasoned business consultants who specialize in the challenges faced by SMEs. Gain strategic guidance, market insights, and actionable advice to steer your business towards success.

- **Collaborative Learning**: Engage in a vibrant learning community where you can share experiences, access educational resources, and learn from peers and industry experts.

- **Real-time Chat**: Seamlessly connect with consultants, peers, and potential investors through our integrated chat feature. Foster meaningful collaborations and receive timely responses to your queries.

## Getting Started

Empower your SME by following these simple steps:

1. **Sign Up**: Create your Fundify account and set up your business profile.

2. **Explore Funding**: Browse through various funding options available on the platform and discover the ones that align with your business aspirations.

3. **Expert Consultation**: Schedule a consultation session with our experienced consultants to gain tailored insights and strategies.

4. **Collaborate and Learn**: Engage in discussions, access a rich library of learning resources, and connect with a supportive community of SMEs.

## Tech Stack

Fundify is built using a robust technology stack to ensure a seamless and secure experience for our users:

- Frontend: React.js
- Backend: Rust
- Database: PostgreSQL
- Deployment: AWS
# Setting up project
First clone it into your local projects

## Setting Up Frontend
1. Install all the dependencies from your terminal
`npm install`
2. Run the projects
`npm run dev`
## Setting Up Backend

To set up the backend of the Fundify project, follow these steps:

1. Navigate to the backend source code directory:
open your terminal \
`$ cd Panitia-Probation/backend/src`
2. Create a `.env` file:
`$ touch .env`
3. Open the `.env` file and add the following content:
```env
POSTGRES_URL="postgresql://postgres:postgres@localhost:5432/projekumkm"
PRIVATE_TOKEN_SIGNATURE="ChooseAnySecretLikeAPassword"
```
Assuming you have already downloaded PostgreSQL, open your terminal (from any directory) and enter the following commands:
`$ psql -U postgres -h localhost`
Inside the PostgreSQL terminal:
`CREATE DATABASE projekumkm;`
Return to the Panitia-Probation/backend/src directory and run the backend:
`$ cargo run`
