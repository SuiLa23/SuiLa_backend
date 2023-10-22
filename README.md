# SuiLa_backend
## How to run the code
### Prerequisits
(NPM)[https://nodejs.org/en/download]
(Docker Desktop)[https://www.docker.com/products/docker-desktop/]
```bash
git clone https://github.com/SuiLa23/SuiLa_backend.git
cd SuiLa_backend
```
### Build docker for postgresql
```bash
docker build -t postgre_image .
```
And check your password and username setting for postgres, change the code that requires those fields.

### Upload mocked_data to database in order to see how it works.
```bash
node resources/init.js
```
This command will upload our sample questions to the database.

### Run
```bash
node app.js
```

Now it's done. 

## What does SuiLa_backend do?
### Key 1. Maintain the question generation-validation-consumption ecosystem by mediating SUI.

- **If you generate question**, you can **earn SUI** when your question is used to certification exam.
- **If you validate the question**, you can **earn SUI** by just answering to very simple questionnaire.
- **If you prepare for exam**, or study language, you can **learn free**!!
- **If you need exam certificate**, you can take your exam in a **very cheap** price, and even the certification deliver is incrediblely easy. Also can get lovely badge NFT.

<details>
<summary>On the other hand...</summary>
<br>
- When you generate question, you need to pay some SUI for cross-validation from the experts.
- The better question are, more higher chance to appear in the exam, and it will bring more SUI. (and also opposite does..)
- When you solves the question during free learning, you are contributing to validate the question by providing the solving data.
</details>

### Key 2. Generate an unique question set desinged to fulfill your purpose while minimize the cost.
- We validate each question by arranging questions into poset(Partially ordered set), leveraging the advantage of massive, decentralized, distributed question solving data.
- Based on the psychometric properties of question, we can collect diverse question from our pool, maximizing the fisher-information the set of question solving outcome gives.
- If your target organization requires strict certificate requires high reliability, we can adjust the confidence interval by upscaling question pool, with a acceptable increase rate of the price.

### Key 3. Provide certification as nft
- As a plenty of pioneers proved, smart contract using NFT is highly reliable and extremly easy to transfer and validate.
- We provides a certification as an badge, and it also allows you to contribute and earn SUI by participant question making and validation process.

## Which features are planned to be uploaded to the SuiLa_backed?
Due to the limited time, we were not available to show everything we prepared. Here are our hidden plans!
### Distributed question-ranking algorithm
We had plans to use POSETs in an uncontrolled, distributed problem-solving environment to align problems using each user's prediction skills, but were unable to demonstrate this due to the significant amount of data and time required to implement. 
### Extreme scalability with using embedding 
Currently, it represents a simple and generalized foreign language ability projected on only one axis, but it can be extended to multiple domains through cognitive analysis, etc.
### Decentralized certificate generation
We're decentralizing each question into an NFT, so anyone can propose a test.
