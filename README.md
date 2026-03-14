# CST8911 Midterm Project

Name: Bosi Chen\
Student Number: 041040774\
[GitHub Link](https://github.com/bosichen-ac/CST8911-Midterm)

## Scenario Overview

In this project, an Azure Virtual Machine using the most cost-effective instance is created to act as a secure management station and testing hub. 

A Cosmos DB is created and an Azure Function App is used to interact with the database using RESTful API functions. 

The Azure Key Vault is used for storing the access keys to the Cosmos DB and Function App.

## Security Architecture

When trying to call the Function App

1. The Function App authenticates Key Vault using its System-Assigned Managed Identity.
2. Azure verifies the identity.
3. The Function App requests access to secrets in Key Vault.
4. Key Vault checks permissions using Role-Based Access Control.
5. The secret values are sent back to the Function App for further actions.

## Workflow

### 1. Create Resource Group

![1](/images/1.png)

### 2. Create Virtual Machine and Save the ssh key

Create a virtual machine

![2-1](/images/2-1.png)
![2-2](/images/2-2.png)
![2-3](/images/2-3.png)

The B2ats (2vcpus, 1GB memory) provides the lowest cost of computing for Canada Central location and is enough for development and testing.

### 3. Create Cosmos DB (NoSQL option)

**Create account**

Create a **serverless** account for NoSQL named `cosmos-midterm`.

![3-1](/images/3-1.png)
![3-2](/images/3-2.png)

Serverless mode is selected because it charges only for request units consumed, and is the ideal for development and testing purposes.

**Create database**

Create database `midterm-db`.

Create a container `items` within the database, with `/id` as the partition key.

![3-3](/images/3-3.png)

### 4. Create Function App

Create the Function App under Consumption Plan, named `function-midterm`.

Runtime stack: Node.js, 22LTS

![4-1](/images/4-1.png)
![4-2](/images/4-2.png)

The Consumption plan is a serverless option and charges only when the function is executing. It is the most cost-effective choice for event-driven but low-traffic functions.

### 5. Create Key Vault

![5-1](/images/5-1.png)
![5-2](/images/5-2.png)

Azure Key Vault is used to store sensitive configuration values such as API access keys. It prevents the secrets from being stored directly in code or configuration files.

The standard pricing tier is the most cost-effective choice of the Key Vault.

### 6. Store Keys in Key Vault

First grant user the Key Fault Secret Officer Role in the Access control(IAM) of the Key Vault.

![6-1](/images/6-1.png)

Store Cosmos DB Primary Key in Key Vault.

Generate a Secret in Key Fault named `cosmos-key` with the Cosmos DB key as value.

![6-2](/images/6-2.png)
![6-3](/images/6-3.png)

Add function access key to Key Vault.

Generate a Secret in Key Fault named `function-default-key` with the default function app key as value

![6-4](/images/6-4.png)
![6-5](/images/6-5.png)

Overview

![6-6](/images/6-6.png)

### 7. Give Function App access to only this secret

In the Access Control IAM, assign Key Vault Secrets User role to the Function App's Managed Identity.

![7-1](/images/7-1.png)
![7-2](/images/7-2.png)

The Function App uses the System-Assigned Managed Identity to allow it be authorized by Azure manages services. It improves the security by eliminating the use of secret values can reduce risk of leaks.

The Function App's System-Assigned Managed Identity is granted the Key Vault Secrets User role, allowing it to only read and write data according to the least-privilege principle.

### 8. Set Up the Function App Environments

| Name                  | Value                              |
| --------------------- | ---------------------------------- |
| COSMOS_KEY_SECRET_URI | Secret Identifier of `cosmos-key`  |
| COSMOS_ENDPOINT       | Cosmos DB URI (from Overview Page) |
| COSMOS_DB_NAME        | `midterm-db`                       |
| COSMOS_CONTAINER_NAME | `items`                            |

![8-1](/images/8-1.png)
![8-2](/images/8-2.png)
![8-3](/images/8-3.png)
![8-4](/images/8-4.png)
![8-5](/images/8-5.png)
![8-6](/images/8-6.png)

Store all the secret configuration strings in the App Environments to make sure that all the sensitive configuration data are kept secret separately instead of hard-coded.

### 9. Create the functions in Function App and Test/Run

Use Microsoft Copilot to generate 3 HTTP-triggered Functions, with Authorization level Function:

| Function name       | API end            | What it does                 |
| ------------------- | ------------------ | ---------------------------- |
| GetItems (GET)      | GET /items         | Get all items from Cosmos DB |
| AddItem (POST)      | POST /items        | Insert a new item to DB      |
| DeleteItem (DELETE) | DELETE /items/{id} | Remove an item by ID         |

The API communicates with Cosmos DB using Node.js. An API key is required for accessing Authorization level Function to ensure that only requests with a valid function access key can touch the API endpoints.

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

Command Palette --> Connect to Host --> Add New SSH Host --> `ssh -i ~/.ssh/cst8911-vm_key.pem azureuser@4.206.218.39` --> save it to the ssh config file and change the `Host` to `cst8911midterm-vm`

Then it will show when you open the Command Palette and select Connect to Host --> click to connect.

![10-1](/images/10-1.png)
![10-2](/images/10-2.png)
![10-3](/images/10-3.png)

Copy the function url from the Code + Test page

![10-4](/images/10-4.png)

curl to test the GetItems function

> Returned [] initially since the container is empty.

![10-5](/images/10-5.png)

curl to test the AddItem function

> Returned the inserted JSON item

![10-6](/images/10-6.png)

Call the GetItems function again to see if the new item is successfully added.

> Returned the container with the new added item.

![10-7](/images/10-7.png)

curl to test the DeleteItem function

> Should return no content

![10-8](/images/10-8.png)

Call the GetItems function again to see if the new item is successfully deleted.

> Returned [] again

![10-9](/images/10-9.png)

### 11. Delete all the resources

![11-1](/images/11-1.png)
![11-2](/images/11-2.png)

## Conclusion

This project shows how a secured, scalable serverless RESTful API function app is created in Azure in a cost-effective way. The Key Vault can help storing secret values securely and the Managed Identity can reduce the complexity of security management.