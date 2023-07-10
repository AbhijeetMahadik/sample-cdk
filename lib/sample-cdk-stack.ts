import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { Bucket, CfnBucket } from 'aws-cdk-lib/aws-s3';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

class L3Bucket extends Construct {
  constructor(scope: Construct, id: string, expiration: number) {
    super(scope, id);

    new Bucket(this, 'L3Bucket', {
      lifecycleRules: [{
        expiration: Duration.days(expiration)
      }]
    });
  }
}

export class SampleCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //create an s3 bucket 3 ways
    //L1 constuct level
    new CfnBucket(this, 'abL1Bucket', {
      lifecycleConfiguration:{
        rules:[{
          expirationInDays: 1,
          status: 'Enabled'
        }]
      }
    });

    //CF Parameters
    const duration = new cdk.CfnParameter(this, 'duration', {
      default: 5,
      minValue: 2,
      maxValue:10,
      type: 'Number'
    })

    //L2 constuct level
    const l2Bucket = new Bucket(this, 'abL2Bucket', {
      lifecycleRules: [
        {
          expiration: cdk.Duration.days(duration.valueAsNumber)
        }
      ]
    })

    //CF output
    new cdk.CfnOutput(this, "L2BucketName", {
      value: l2Bucket.bucketName
    })

    //L3 constuct level
    new L3Bucket(this, 'abL3Bucket', 3);






    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'SampleCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
