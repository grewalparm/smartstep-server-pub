import * as cdk from "aws-cdk-lib";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class AiTutorServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const openaiAPILambdaFunction = new NodejsFunction(
      this,
      "openaiAPILambdaFunction",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "helloTestHandler",
        entry: "lambdas/openAPILambdaFunction.ts",
      }
    );

    const getModelsLambda = new NodejsFunction(this, "getModelsLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "getModelsHandler",
      entry: "lambdas/openAPILambdaFunction.ts",
      environment: {
        OPENAI_API_KEY: "",//REMOVED FOR SECURITY PURPOSES. WILL BE MOVING THIS TO AWS SECRETS MANAGER SOON
      },
    });

    const getQuestionLambda = new NodejsFunction(this, "getQuestionLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "getQuestionHandler",
      entry: "lambdas/openAPILambdaFunction.ts",
      environment: {
        OPENAI_API_KEY: "",//REMOVED FOR SECURITY PURPOSES. WILL BE MOVING THIS TO AWS SECRETS MANAGER SOON
      },
      timeout: cdk.Duration.millis(10000),
    });

    const getChatCompletionLambda = new NodejsFunction(
      this,
      "getChatCompletionLambda",
      {
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "getChatCompletionHandler",
        entry: "lambdas/openAPILambdaFunction.ts",
        environment: {
          OPENAI_API_KEY: "",//REMOVED FOR SECURITY PURPOSES. WILL BE MOVING THIS TO AWS SECRETS MANAGER SOON
        },
        timeout: cdk.Duration.millis(10000),
      }
    );

    const api = new apigateway.RestApi(this, "openaiAPI", {
      restApiName: "openaiAPI",
      description: "API for using openai API",
      defaultCorsPreflightOptions: {
        allowOrigins: ["https://smartstepai.com"], // Adjusted the allowOrigins to include http://localhost:3000
      },
    });

    const testResource = api.root.addResource("hello-test");
    testResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(openaiAPILambdaFunction)
    );

    const getModelsResource = api.root.addResource("getModels");
    getModelsResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getModelsLambda)
    );

    const getQuestionResource = api.root.addResource("getQuestion");
    getQuestionResource.addMethod(
      "GET",
      new apigateway.LambdaIntegration(getQuestionLambda)
    );

    const getChatCompletionResource = api.root.addResource("getChatCompletion");
    getChatCompletionResource.addMethod(
      "POST",
      new apigateway.LambdaIntegration(getChatCompletionLambda)
    );
    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'AiTutorServerQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
