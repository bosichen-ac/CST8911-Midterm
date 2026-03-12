# CST8911-Midterm

## Workflow

> Scenario 1

### 1. Create Resource Group

![1](/images/1.png)

### 2. Create Virtual Machine

![2-1](/images/2-1.png)
![2-2](/images/2-2.png)
![2-3](/images/2-3.png)

### 3. Create Cosmos DB (NoSQL option)

**Create account**

Create a **serverless** account named `cosmos-midterm`.

![3-1](/images/3-1.png)
![3-2](/images/3-2.png)

**Create database**

Create database `midterm-db`.

Create a container `items` within the database, with `/id` as the partition key.

![3-3](/images/3-3.png)

### 4. Create Function App

Create the Function App under Consumption Plan, named `function-midterm`

![4-1](/images/4-1.png)
![4-2](/images/4-2.png)

### 5. Create Key Vault

![5-1](/images/5-1.png)
![5-2](/images/5-2.png)

### 6. Store Keys in Key Vault

First grant user the Key Fault Secret Officer Role in the Access control(IAM) of the Key Vault.

![6-1](/images/6-1.png)

Store Cosmos DB Primary Key in Key Vault.

Generate a Secret in Key Fault named `cosmos-key` with the Cosmos DB key as value.

![6-2](/images/6-2.png)
![6-3](/images/6-3.png)

Add function access key to Key Vault.

Generate a Secret in Key Fault named `funcion-default-key` with the default function app key as value

![6-4](/images/6-4.png)
![6-5](/images/6-5.png)

Overview

![6-6](/images/6-6.png)

### 7. Give Function App access to only this secret

In the Access Control IAM, assign Key Vault Secrets User role to the Function App’s Managed Identity.

![7-1](/images/7-1.png)
![7-2](/images/7-2.png)

### 8. Set Up the Function App Environments

COSMOS_KEY_SECRET_URI
COSMOS_ENDPOINT
COSMOS_DB_NAME
COSMOS_CONTAINER_NAME

![8-1](/images/8-1.png)
![8-2](/images/8-2.png)
![8-3](/images/8-3.png)
![8-4](/images/8-4.png)
![8-5](/images/8-5.png)
![8-6](/images/8-6.png)

### 9. Create the functions in Function App and Test/Run

Use Microsoft Copilot to create 3 HTTP-triggered Functions:

- GetItems (GET)
- AddItem (POST)
- DeleteItem (DELETE)

Create the three functions

![9-1](/images/9-1.png)
![9-2](/images/9-2.png)
![9-3](/images/9-3.png)
![9-4](/images/9-4.png)

Add dependencies

Go to Development Tools → Advanced Tools → Go → Debug Console → PowerShell, create a `package.json` file. 

![9-5](/images/9-5.png)

Go to App Files and add the dependencies code into `package.json`.

![9-6](/images/9-6.png)

Test/Run the three functions to make sure it works.

GetItems (GET)

![9-7](/images/9-7.png)
![9-8](/images/9-8.png)

AddItem (POST)

![9-9](/images/9-9.png)
![9-10](/images/9-10.png)

DeleteItem (DELETE)

Edit the Trigger of DeleteItem first to have the correct HTTP method and route, and then Test/Run.

![9-11](/images/9-11.png)
![9-12](/images/9-12.png)
![9-13](/images/9-13.png)

### 10. Test the functions from virtual machines

Use VSCode to SSH into the VM created in the previous steps.

![10-1](/images/10-1.png)
![10-2](/images/10-2.png)
![10-3](/images/10-3.png)

Get the function url from the Code + Test page

![10-4](/images/10-4.png)

curl to test the GetItems function

![10-5](/images/10-5.png)

curl to test the AddItem function

![10-6](/images/10-6.png)

Call the GetItems function again to see if the new item is successfully added.

![10-7](/images/10-7.png)

curl to test the DeleteItem function

![10-8](/images/10-8.png)

Call the GetItems function again to see if the new item is successfully deleted.

![10-9](/images/10-9.png)

### 11. Delete all the resources

![11-1](/images/11-1.png)