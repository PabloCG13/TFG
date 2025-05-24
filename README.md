# Blockchain-based Academic Record System

This repository contains the code used in the development of the Final Degree Project for the **Faculty of Computer Science** of **Complutense University of Madrid**.

## Authors
Luis Caballero Molero

Pablo Agustín Chicharro Gómez

Luis López Sáez

## Directors
Jesús Correas Fernández

Pablo Gordillo Alguacil


## Abstract
This Final Degree Project consists in the development of an application that handles the students’ enrolment process and transcripts for both courses that they take at their home university and courses that they take abroad. Our project is mainly focused on the selection and enrolment of an Erasmus course, by automating the process and limiting human interaction to the bare minimum required.

To achieve this goal, we have profited from the benefits that the blockchain technology provides, mainly the fact that it guarantees a decentralized system capable of ensuring transaction integrity between many participants. This is the reason why the blockchain plays a fundamental role in verifying the security and safety with regards to everything that is stored in the system guaranteeing that no information has been tampered with.

The development of the application covers from the planning stage all the way to the implementation phase, including the development of the user interfaces and the backend architecture. This project explores a very valuable alternative for all those students and teachers that are involved in the Erasmus programme processes, attempting to make it as accessible as possible.


## Contents
This is a micro-services based application using Docker Compose. There is a ```docker-compose.yml``` with the configuration of the services that is used to launch the system. There are two types of containers that are used: container images that are downloaded from the docker hub and used directly, and custom containers which have their own folder and set up in the project.

- **nginx**: Contains the configuration for the reverse-proxy nginx-hosted server.
- **frontend**: Contains the React frontend service.
- **api**: Contains the Express API service.
- **truffle**: Contains the Express & Truffle Blockchain API service.
- **Database**: Contains the database schema for the deployed database. The real database scripts is stored in ```api/scripts/init-db.sql```

# Project Setup & Usage Guide
## General

### Launching the Application

To launch the application, from the application's root folder, run:

```bash
docker compose up
```

- The frontend service will be available through web browser at: [http://localhost:3000](http://localhost:3000)

### Truffle Commands

To run Truffle commands, run this command from a separate terminal:

```bash
docker exec -it tfg-truffle-1 sh
```

> If the above command doesn't work, run `docker ps` and use the container ID for the Truffle container.

- Enter the Truffle shell:

```bash
truffle console --network development
```

- Deploy the TFG contract:

```bash
truffle migrate --network development
```

- Copy the generated TFG smart contract address into the constant ```NEW_CONTRACT_ADDRESS``` in the file ```truffle/replace_contract_address.js```

- Run the edited file from the truffle console

```bash
node replace_contract_address.js
```

The blockchain service will now be fully operational, and the application is now usable. 

To stop the application,  press **`Ctrl+C`** in your docker terminal (not the truffle terminal).

- To run the application again, you will only need to execute the initial command: 

```bash
docker compose up
```

- Otherwise, in order to reset the application to a default state, run:

```bash
docker compose down
```

You will have to repeat the set up process to be able to use the application again.


---

## PGAdmin

### Accessing PGAdmin

- Navigate to: [http://localhost:8080](http://localhost:8080)
- Login credentials:
  - **Email:** admin@admin.com
  - **Password:** admin

### Initial Setup

1. Click **"Add new server"** in the center panel.
2. Under the **Connection** tab, set the following:
   - **Host name:** `db`
   - **Port:** `5432`
   - **Username/Password:** `postgres`

### Viewing Tables

- In the left column, expand the server you added:
  ```
  Servers → [Your Server] → Databases → [Your DB] → Schemas → public → Tables
  ```

### Viewing & Editing Table Data

- Right-click the desired table and select **View/Edit Data**.

### Running Queries

1. Click **Tools** → **Query Tool**.
2. Use the text area to write queries or scripts.
3. Click the **>** (Execute) button to run queries.
4. Results will appear in the **Data Output** section below.

---

## Ganache

### Using the Ganache-CLI Container

- Use the following connection in Truffle:
  ```
  http://ganache:8545
  ```

### Running Your Own Ganache Instance

If not using the container, use the appropriate IP and port:

- **GUI Version:** `http://127.0.0.1:7545`
- **CLI Version:** `http://127.0.0.1:8545`

### Ganache Test Accounts

These are the test accounts generated by ganache by our current configuration. They will be automatically assigned to new participants of the system by the application. If you modify the Ganache configuration, these may change.

| Index | Address | Balance |
|-------|------------------------------------------|---------|
| 0 | `0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1` | 500 |
| 1 | `0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0` | 500 |
| 2 | `0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b` | 500 |
| 3 | `0xE11BA2b4D45Eaed5996Cd0823791E0C93114882d` | 500 |
| 4 | `0xd03ea8624C8C5987235048901fB614fDcA89b117` | 500 |
| 5 | `0x95cED938F7991cd0dFcb48F0a06a40FA1aF46EBC` | 500 |
| 6 | `0x3E5e9111Ae8eB78Fe1CC3bb8915d5D461F3Ef9A9` | 500 |
| 7 | `0x28a8746e75304c0780E011BEd21C72cD78cd535E` | 500 |
| 8 | `0xACa94ef8bD5ffEE41947b4585a84BdA5a3d3DA6E` | 500 |
| 9 | `0x1dF62f291b2E969fB0849d99D9Ce41e2F137006e` | 500 |
| 10 | `0x610Bb1573d1046FCb8A70Bbbd395754cD57C2b60` | 500 |
| 11 | `0x855FA758c77D68a04990E992aA4dcdeF899F654A` | 500 |
| 12 | `0xfA2435Eacf10Ca62ae6787ba2fB044f8733Ee843` | 500 |
| 13 | `0x64E078A8Aa15A41B85890265648e965De686bAE6` | 500 |
| 14 | `0x2F560290FEF1B3Ada194b6aA9c40aa71f8e95598` | 500 |
| 15 | `0xf408f04F9b7691f7174FA2bb73ad6d45fD5d3CBe` | 500 |
| 16 | `0x66FC63C2572bF3ADD0Fe5d44b97c2E614E35e9a3` | 500 |
| 17 | `0xF0D5BC18421fa04D0a2A2ef540ba5A9f04014BE3` | 500 |
| 18 | `0x325A621DeA613BCFb5B1A69a7aCED0ea4AfBD73A` | 500 |
| 19 | `0x3fD652C93dFA333979ad762Cf581Df89BaBa6795` | 500 |
| 20 | `0x73EB6d82CFB20bA669e9c178b718d770C49BB52f` | 500 |
| 21 | `0x9D8E5fAc117b15DaCED7C326Ae009dFE857621f1` | 500 |
| 22 | `0x982a8CbE734cb8c29A6a7E02a3B0e4512148F6F9` | 500 |
| 23 | `0xCDC1E53Bdc74bBf5b5F715D6327Dca5785e228B4` | 500 |
| 24 | `0xf5d1EAF516eF3b0582609622A221656872B82F78` | 500 |
| 25 | `0xf8eA26C3800D074a11bf814dB9a0735886C90197` | 500 |
| 26 | `0x2647116f9304abb9F0B7aC29aBC0D9aD540506C8` | 500 |
| 27 | `0x80a32A0E5cA81b5a236168C21532B32e3cBC95e2` | 500 |
| 28 | `0x47f55A2ACe3b84B0F03717224DBB7D0Df4351658` | 500 |
| 29 | `0xC817898296b27589230B891f144dd71A892b0C18` | 500 |
| 30 | `0x0D38e653eC28bdea5A2296fD5940aaB2D0B8875c` | 500 |
| 31 | `0x1B569e8f1246907518Ff3386D523dcF373e769B6` | 500 |
| 32 | `0xCBB025e7933FADfc7C830AE520Fb2FD6D28c1065` | 500 |
| 33 | `0xdDEEA4839bBeD92BDAD8Ec79AE4f4Bc2Be1A3974` | 500 |
| 34 | `0xBC2cf859f671B78BA42EBB65Deb31Cc7fEc07019` | 500 |
| 35 | `0xF75588126126DdF76bDc8aBA91a08f31d2567Ca5` | 500 |
| 36 | `0x369109C74ea7159E77e180f969f7D48c2bf19b4C` | 500 |
| 37 | `0xA2A628f4eEE25F5b02B0688Ad9c1290e2e9A3D9e` | 500 |
| 38 | `0x693D718cCfadE6F4A1379051D6ab998146F3173F` | 500 |
| 39 | `0x845A0F9441081779110FEE40E6d5d8b90cE676eF` | 500 |
| 40 | `0xC7739909e08A9a0F303A010d46658Bdb4d5a6786` | 500 |
| 41 | `0x99cce66d3A39C2c2b83AfCefF04c5EC56E9B2A58` | 500 |
| 42 | `0x4b930E7b3E491e37EaB48eCC8a667c59e307ef20` | 500 |
| 43 | `0x02233B22860f810E32fB0751f368fE4ef21A1C05` | 500 |
| 44 | `0x89c1D413758F8339Ade263E6e6bC072F1d429f32` | 500 |
| 45 | `0x61bBB5135b43F03C96570616d6d3f607b7103111` | 500 |
| 46 | `0x8C4cE7a10A4e38EE96feD47C628Be1FfA57Ab96e` | 500 |
| 47 | `0x25c1230C7EFC00cFd2fcAA3a44f30948853824bc` | 500 |
| 48 | `0x709F7Ae06Fe93be48FbB90FFDDd69e2746FA8506` | 500 |
| 49 | `0xc0514C03D097fCbB77a74B4DA5b594bA473b6CE1` | 500 |
| 50 | `0x103b31135D99417A22684ED93cbbCD4ccD208046` | 500 |
| 51 | `0xf8856d473639e40f60db8979F5752A9C15903Bb2` | 500 |
| 52 | `0x753897706061FDE347465055FcAc4bd040745624` | 500 |
| 53 | `0x7cd15A5d345558A203655e40B1afb14F936C73f7` | 500 |
| 54 | `0x7d8Ae65273B9D1E6B239b36aF9AdEA0414D189B7` | 500 |
| 55 | `0x05a561F51a2D8A092B11e20C72b5dF15A9D82278` | 500 |
| 56 | `0x80030beCa8292f416E7906535668475c75d9c47E` | 500 |
| 57 | `0xeDA51422804340e3Dc0DD9b6D441125b5C7Cf3FF` | 500 |
| 58 | `0xE21812faA737FF0eEec268f509ACb306BC735feC` | 500 |
| 59 | `0x4d85247717Cf8621D7894F36De35E8B6B6d384BC` | 500 |
| 60 | `0x19b2d46091Dd332F0753dAbf0CF8304cf61eD1c5` | 500 |
| 61 | `0x42c7c045729a84f8e65239308cA8279D6fb21c89` | 500 |
| 62 | `0xEeD15Bb091bf3F615400f6F8160aC423EaF6a413` | 500 |
| 63 | `0x0F6F0ecfAB78f8E54B130E3b3EBd88B3613c97D1` | 500 |
| 64 | `0x33A053885A8232eD78D688B43a405587ba446e5E` | 500 |
| 65 | `0x4397655dDd031043Eb0859AD7A90c3c889E12A4d` | 500 |
| 66 | `0x6E57514B1997029500C13007A59fb6da1CeAc7C4` | 500 |
| 67 | `0x85c38d25744f02619047B76195EcF835554F70Bc` | 500 |
| 68 | `0x69901C8c4263A0368c19D3Cd9dC51B09BeC4C4b1` | 500 |
| 69 | `0x256DD44a34478AceC9A7da479DBcf0C3C599AD55` | 500 |
| 70 | `0x61f41c87113e04B32eB8FbaA4946b1ef98479756` | 500 |
| 71 | `0xA8BA9dEa29234Be7504fAE477d2f6B1fd1078D46` | 500 |
| 72 | `0x831c50Ac59c3794185fABAe289D3a5bA8B09403C` | 500 |
| 73 | `0xc8f2d6111bc7207c25eB4f944cb29F0E851a8541` | 500 |
| 74 | `0xBcA6ebD43DCB10851F398b4CB8FbAdE3133b2c45` | 500 |
| 75 | `0x856C1365488375d21875f80d6045C956E47Ed5eC` | 500 |
| 76 | `0x356780865cD279e4D2dC6d99B32eDA8FD8E8A39c` | 500 |
| 77 | `0x1baEC60a021C5e26a1071776A1549C45C79951d5` | 500 |
| 78 | `0x8155EB275eA6Ebd0d572a44087C948b02d794013` | 500 |
| 79 | `0x6a8bBdB024861739B0DCD1700c8b8F603f1cf7c6` | 500 |
| 80 | `0xB890C74caA6C052Db376837E67F0476589991922` | 500 |
| 81 | `0xd5B6d6b730b1C1be10b82a0A1c89f1Db24f752C3` | 500 |
| 82 | `0x2A828ADcc1a3647DBA43eD05375a4d0B00eEA789` | 500 |
| 83 | `0x624a97293d8cea5ca78D538aC6599e4051a19174` | 500 |
| 84 | `0xE7a3eBbA0647Fb07D0b21927305aA95284316993` | 500 |
| 85 | `0xd74485a6600d8dE95d84d5E1747480c528Df1f9a` | 500 |
| 86 | `0x3B1Cb706E5fff494Da8873aD9C1A30aa802f4522` | 500 |
| 87 | `0xfBDB66Ae3FA6F1B37A02c82751117FC3Aad4572b` | 500 |
| 88 | `0x4F92c13CACF198eB25698709e3d225E6A2E22Dd8` | 500 |
| 89 | `0x18282Ec61C35bef47698C3E65314C9A0ff617b3c` | 500 |
| 90 | `0xAfa5e9d58e245b7F3efECC9e706B06D52Cd28Da1` | 500 |
| 91 | `0xd32115D6e4a4DFdf0807544723D514E3F293D3B6` | 500 |
| 92 | `0x56Fa56dc28081f6353737061e2278631B2659598` | 500 |
| 93 | `0x3Fae75Cce89a972FA1b6d87Bb080fb2c6060F0B3` | 500 |
| 94 | `0xa9F913312b7ec75f755c4f3EdB6e2BBd3526b918` | 500 |
| 95 | `0x1f627b7Fb483E5B8d59aa191FEc94D01753c7d24` | 500 |
| 96 | `0xb45dE3796b206793E8aD3509202Da91D35E9A6d9` | 500 |
| 97 | `0x17332DD7f9BD584E2E83f4cFfdCA0a448B3B903a` | 500 |
| 98 | `0x9d7822d5bB9f7b9b655669550095d2F14AFaC469` | 500 |
| 99 | `0x4C0408DB276Ef793333BAF5B226d8b180c3D0A89` | 500 |
