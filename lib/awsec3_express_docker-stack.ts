import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';

/**
 * Enter DockerHub path here (example -> nitnub/ci-cd-testing)
 */

const dockerHubPath = 'nitnub/ci-cd-testing';

export class Awsec3ExpressDockerStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Virtual Private Cloud
    const vpc = new ec2.Vpc(this, 'helloVpc', { maxAzs: 2 });

    // Create an ECS cluster
    var cluster = new ecs.Cluster(this, 'Cluster', { vpc });
    cluster.addCapacity('DefaultAutoScalingGroup', {
      instanceType: new ec2.InstanceType('t2.micro'),
      maxCapacity: 3,
    });

    // hello service
    const helloTaskDefinition = new ecs.Ec2TaskDefinition(
      this,
      'hello-task-definition',
      {}
    );
    // Spinning up containers and pulling image from docker hub
    const helloContainer = helloTaskDefinition.addContainer('hello', {
      image: ecs.ContainerImage.fromRegistry(dockerHubPath),
      memoryLimitMiB: 128,
    });

    helloContainer.addPortMappings({
      containerPort: 3000,
    });

    const helloService = new ecs.Ec2Service(this, 'hello-service', {
      cluster: cluster,
      desiredCount: 3,
      taskDefinition: helloTaskDefinition,
    });
    // Internet facing load balancer for the frontend services

    const externalLB = new elbv2.ApplicationLoadBalancer(this, 'external', {
      vpc: vpc,
      internetFacing: true,
    });

    const externalListener = externalLB.addListener('PublicListener', {
      port: 80,
      open: true,
    });

    // run helloService defined above and expose on port 80
    externalListener.addTargets('greeter', {
      port: 80,
      targets: [helloService],
    });

    // external URL for exposed port
    new cdk.CfnOutput(this, 'ExternalDNS', {
      value: externalLB.loadBalancerDnsName,
    });
  }
}
