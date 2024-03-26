# Catoff-backend

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Dependencies](#dependencies)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)
- [Contributors](#contributors)

## Introduction

Catoff is a peer-to-peer (P2P) wagering decentralized application (dapp) that brings the frictionless experience of web3 to web2 users without them even knowing it. Utilizing advanced technologies such as account abstraction for seamless user onboarding through the Okto/CoinDCX wallet, and leveraging the decentralized oracles, zero-knowledge proofs (ZKproofs) via the Reflaim Protocol, and smart contracts for executing payments, Catoff revolutionizes the way real-life bets are placed, tracked, and settled.

Catoff caters to a wide array of use cases from fitness challenges (distance, calories, steps) to skill-based competitions (cooking, poetry, cricket), and even web-based metrics (Instagram likes, YouTube views). Whether it's 0 to 1 dare or dependency bets, 1 to 1 duels, or global competitions, Catoff provides a platform for competitors to engage in friendly yet competitive wagering, with instant payouts to the winners, thereby eliminating the hassle of debt collection and data tracking in traditional betting scenarios.

## Features

- **Frictionless Web3 Experience for Web2 Users**: Smooth onboarding with account abstraction via Okto/CoinDCX wallet.
- **Diverse Competition Types**: Support for a variety of challenges including fitness, skill-based, and web metrics.
- **Instant Payouts**: Utilizes smart contracts and ZKproofs for immediate distribution of winnings.
- **Dispute Resolution**: Architecture supports raising disputes by users for fair play.
- **Google Social Login**: Easy signup process through Google to attract web2 audience.
- **Blockchain-validated Data**: Leverages blockchain technology to validate off-chain data for executing transactions based on deterministic outcomes.
- **Gamification of IRL Activities**: Unique ability to turn everyday activities into competitive challenges, introducing a new audience to web3.

## Installation

To get started with Catoff, ensure you have Node.js installed on your system. Then follow the steps below:

```bash
# Clone the repository
git clone https://github.com/CatoffGaming/catoff-backend.git

# Navigate to the project directory
cd catoff-backend

# Install dependencies
npm install
```

## Usage

To run the Catoff backend server, use the following commands:

```bash
# Start the server (development)
npm start

# Start the server with verbose logging
npm run start:verbose
```

For production environments, it's recommended to use a process manager like PM2 for better process management and automatic restarts.

## Dependencies

Catoff is built using Node.js and Express for the backend, with Sequelize ORM for database management. Here's a brief overview of its key dependencies:

- Express
- Sequelize ORM
- PostgreSQL
- Node-cron
- Swagger UI Express
- Google APIs
- Various cryptographic and utility libraries (e.g., bcrypt, jsonwebtoken, dotenv)

A complete list of dependencies can be found in the `package.json` file.

## Configuration

Before running Catoff, configure your environment variables by copying the `.env.sample` file to a new file named `.env` and filling in the values:

```plaintext
POSTGRESQL_DB_URI=your_postgresql_db_uri
JWT_SECRET=your_jwt_secret
RPC_URL=https://api.devnet.solana.com
PORT_WWW=3001
PORT_APP=3005
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=your_google_redirect_uri
SUCCESS_REDIRECT_URL=your_google_success_redirect_url
OKTO_TECH_API_CLIENT_KEY=your_okto_tech_api_client_key
```

Ensure that you replace `your_*` placeholders with actual values relevant to your environment.

## API Documentation

Catoff's API is documented using Swagger, providing a clear and interactive documentation of the available endpoints, their parameters, and expected responses. You can access the API documentation by navigating to `/api-docs` on your deployed instance of Catoff. The Swagger documentation offers a detailed overview of endpoints such as user authentication, Google OAuth flows, user board information retrieval, player management, and proxy services for Okto authentication and wallet management.

## API Documentation

API documentation is available via Swagger UI at `/api-docs` endpoint, providing a comprehensive guide to the available endpoints and their usage.

### Database Schema

Our current database schema is outlined in [this Google Doc](https://docs.google.com/document/d/1aJsKkjE_nVpk6sXgn8zJzDbCVslb2NKAprPZsIjD1fg/edit?usp=sharing). We encourage anyone to come in and leave their comments or suggestions for improvements. This is an essential part of our continuous improvement process, and we value your feedback.

To leave a comment, please:

1. Open the link.
2. Highlight the text you wish to comment on.
3. Right-click and choose `Comment` or use the commenting feature in the Google Docs toolbar.

We appreciate your input to help enhance our project's design and functionality.

## Troubleshooting

For any issues encountered while installing or running the Catoff server, please check the following:

- Ensure all environment variables are correctly set.
- Verify that the PostgreSQL database is running and accessible.
- Consult the error logs for specific messages and consult the documentation or community forums for solutions.

## Contributors

Catoff is currently being developed by a dedicated team focused on backend, frontend, and smart contract development. We are open to contributions and collaboration. Please reach out if you are interested in contributing at antklor@gmail.com.
