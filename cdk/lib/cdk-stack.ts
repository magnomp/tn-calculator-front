import { Construct } from "constructs";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";
import * as origins from "aws-cdk-lib/aws-cloudfront-origins";
import * as route53 from "aws-cdk-lib/aws-route53";
import * as route53targets from "aws-cdk-lib/aws-route53-targets";
import * as cdk from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as rds from 'aws-cdk-lib/aws-rds'
import * as ec2 from 'aws-cdk-lib/aws-ec2'
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager'
import * as s3_deployment from 'aws-cdk-lib/aws-s3-deployment'
import * as ecr from 'aws-cdk-lib/aws-ecr'
import * as iam from 'aws-cdk-lib/aws-iam'
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets'

export interface CdkStackProps extends cdk.StackProps {
  endpoint: string
}

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CdkStackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });

    const bucket = new s3.Bucket(this, "app-bucket", {});

    const origin = new origins.S3Origin(bucket);
    const distribution = new cloudfront.Distribution(this, "dist", {
      defaultBehavior: {
        origin: origin,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
      },
      additionalBehaviors: {
        "/index.html": {
          origin: origin,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
        },
      },
      defaultRootObject: "index.html",
    });

    new s3_deployment.BucketDeployment(this, "BucketDeployment", {
      destinationBucket: bucket,
      distribution: distribution,
      sources: [
        s3_deployment.Source.asset('../app', {
          bundling: {
            image: cdk.DockerImage.fromRegistry('node:19'),
            environment: {
              VITE_TNCALC_ENDPOINT: props.endpoint,
            },
            command: [
              "/bin/bash", "-c",
              "yarn --frozen-lockfile; yarn vite build; cp -r dist/* /asset-output/"
            ]
          }
        })
      ],
    })

    new cdk.CfnOutput(this, 'front_url', {
      value: distribution.distributionDomainName
    })
  }
}
