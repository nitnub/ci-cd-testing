"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Awsec3ExpressDockerStack = void 0;
const cdk = require("@aws-cdk/core");
const ec2 = require("@aws-cdk/aws-ec2");
const ecs = require("@aws-cdk/aws-ecs");
const elbv2 = require("@aws-cdk/aws-elasticloadbalancingv2");
/**
 * Enter DockerHub path here (example -> nitnub/ci-cd-testing)
 */
const dockerHubPath = 'nitnub/ci-cd-testing';
class Awsec3ExpressDockerStack extends cdk.Stack {
    constructor(scope, id, props) {
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
        const helloTaskDefinition = new ecs.Ec2TaskDefinition(this, 'hello-task-definition', {});
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
exports.Awsec3ExpressDockerStack = Awsec3ExpressDockerStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFDQUFxQztBQUNyQyx3Q0FBd0M7QUFDeEMsd0NBQXdDO0FBQ3hDLDZEQUE2RDtBQUU3RDs7R0FFRztBQUVILE1BQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFDO0FBRTdDLE1BQWEsd0JBQXlCLFNBQVEsR0FBRyxDQUFDLEtBQUs7SUFDckQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHdCQUF3QjtRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRXpELHdCQUF3QjtRQUN4QixJQUFJLE9BQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7UUFDeEQsT0FBTyxDQUFDLFdBQVcsQ0FBQyx5QkFBeUIsRUFBRTtZQUM3QyxZQUFZLEVBQUUsSUFBSSxHQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxXQUFXLEVBQUUsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixNQUFNLG1CQUFtQixHQUFHLElBQUksR0FBRyxDQUFDLGlCQUFpQixDQUNuRCxJQUFJLEVBQ0osdUJBQXVCLEVBQ3ZCLEVBQUUsQ0FDSCxDQUFDO1FBQ0YsMkRBQTJEO1FBQzNELE1BQU0sY0FBYyxHQUFHLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUU7WUFDL0QsS0FBSyxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsWUFBWSxDQUFDLGFBQWEsQ0FBQztZQUNyRCxjQUFjLEVBQUUsR0FBRztTQUNwQixDQUFDLENBQUM7UUFFSCxjQUFjLENBQUMsZUFBZSxDQUFDO1lBQzdCLGFBQWEsRUFBRSxJQUFJO1NBQ3BCLENBQUMsQ0FBQztRQUVILE1BQU0sWUFBWSxHQUFHLElBQUksR0FBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzdELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFlBQVksRUFBRSxDQUFDO1lBQ2YsY0FBYyxFQUFFLG1CQUFtQjtTQUNwQyxDQUFDLENBQUM7UUFDSCwwREFBMEQ7UUFFMUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxLQUFLLENBQUMsdUJBQXVCLENBQUMsSUFBSSxFQUFFLFVBQVUsRUFBRTtZQUNyRSxHQUFHLEVBQUUsR0FBRztZQUNSLGNBQWMsRUFBRSxJQUFJO1NBQ3JCLENBQUMsQ0FBQztRQUVILE1BQU0sZ0JBQWdCLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsRUFBRTtZQUNoRSxJQUFJLEVBQUUsRUFBRTtZQUNSLElBQUksRUFBRSxJQUFJO1NBQ1gsQ0FBQyxDQUFDO1FBRUgsdURBQXVEO1FBQ3ZELGdCQUFnQixDQUFDLFVBQVUsQ0FBQyxTQUFTLEVBQUU7WUFDckMsSUFBSSxFQUFFLEVBQUU7WUFDUixPQUFPLEVBQUUsQ0FBQyxZQUFZLENBQUM7U0FDeEIsQ0FBQyxDQUFDO1FBRUgsZ0NBQWdDO1FBQ2hDLElBQUksR0FBRyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsYUFBYSxFQUFFO1lBQ3JDLEtBQUssRUFBRSxVQUFVLENBQUMsbUJBQW1CO1NBQ3RDLENBQUMsQ0FBQztJQUNMLENBQUM7Q0FDRjtBQTFERCw0REEwREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnQGF3cy1jZGsvY29yZSc7XHJcbmltcG9ydCAqIGFzIGVjMiBmcm9tICdAYXdzLWNkay9hd3MtZWMyJztcclxuaW1wb3J0ICogYXMgZWNzIGZyb20gJ0Bhd3MtY2RrL2F3cy1lY3MnO1xyXG5pbXBvcnQgKiBhcyBlbGJ2MiBmcm9tICdAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2Mic7XHJcblxyXG4vKipcclxuICogRW50ZXIgRG9ja2VySHViIHBhdGggaGVyZSAoZXhhbXBsZSAtPiBuaXRudWIvY2ktY2QtdGVzdGluZylcclxuICovXHJcblxyXG5jb25zdCBkb2NrZXJIdWJQYXRoID0gJ25pdG51Yi9jaS1jZC10ZXN0aW5nJztcclxuXHJcbmV4cG9ydCBjbGFzcyBBd3NlYzNFeHByZXNzRG9ja2VyU3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xyXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBjZGsuQXBwLCBpZDogc3RyaW5nLCBwcm9wcz86IGNkay5TdGFja1Byb3BzKSB7XHJcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcclxuXHJcbiAgICAvLyBWaXJ0dWFsIFByaXZhdGUgQ2xvdWRcclxuICAgIGNvbnN0IHZwYyA9IG5ldyBlYzIuVnBjKHRoaXMsICdoZWxsb1ZwYycsIHsgbWF4QXpzOiAyIH0pO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhbiBFQ1MgY2x1c3RlclxyXG4gICAgdmFyIGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgJ0NsdXN0ZXInLCB7IHZwYyB9KTtcclxuICAgIGNsdXN0ZXIuYWRkQ2FwYWNpdHkoJ0RlZmF1bHRBdXRvU2NhbGluZ0dyb3VwJywge1xyXG4gICAgICBpbnN0YW5jZVR5cGU6IG5ldyBlYzIuSW5zdGFuY2VUeXBlKCd0Mi5taWNybycpLFxyXG4gICAgICBtYXhDYXBhY2l0eTogMyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGhlbGxvIHNlcnZpY2VcclxuICAgIGNvbnN0IGhlbGxvVGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICAnaGVsbG8tdGFzay1kZWZpbml0aW9uJyxcclxuICAgICAge31cclxuICAgICk7XHJcbiAgICAvLyBTcGlubmluZyB1cCBjb250YWluZXJzIGFuZCBwdWxsaW5nIGltYWdlIGZyb20gZG9ja2VyIGh1YlxyXG4gICAgY29uc3QgaGVsbG9Db250YWluZXIgPSBoZWxsb1Rhc2tEZWZpbml0aW9uLmFkZENvbnRhaW5lcignaGVsbG8nLCB7XHJcbiAgICAgIGltYWdlOiBlY3MuQ29udGFpbmVySW1hZ2UuZnJvbVJlZ2lzdHJ5KGRvY2tlckh1YlBhdGgpLFxyXG4gICAgICBtZW1vcnlMaW1pdE1pQjogMTI4LFxyXG4gICAgfSk7XHJcblxyXG4gICAgaGVsbG9Db250YWluZXIuYWRkUG9ydE1hcHBpbmdzKHtcclxuICAgICAgY29udGFpbmVyUG9ydDogMzAwMCxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGhlbGxvU2VydmljZSA9IG5ldyBlY3MuRWMyU2VydmljZSh0aGlzLCAnaGVsbG8tc2VydmljZScsIHtcclxuICAgICAgY2x1c3RlcjogY2x1c3RlcixcclxuICAgICAgZGVzaXJlZENvdW50OiAzLFxyXG4gICAgICB0YXNrRGVmaW5pdGlvbjogaGVsbG9UYXNrRGVmaW5pdGlvbixcclxuICAgIH0pO1xyXG4gICAgLy8gSW50ZXJuZXQgZmFjaW5nIGxvYWQgYmFsYW5jZXIgZm9yIHRoZSBmcm9udGVuZCBzZXJ2aWNlc1xyXG5cclxuICAgIGNvbnN0IGV4dGVybmFsTEIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIodGhpcywgJ2V4dGVybmFsJywge1xyXG4gICAgICB2cGM6IHZwYyxcclxuICAgICAgaW50ZXJuZXRGYWNpbmc6IHRydWUsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBleHRlcm5hbExpc3RlbmVyID0gZXh0ZXJuYWxMQi5hZGRMaXN0ZW5lcignUHVibGljTGlzdGVuZXInLCB7XHJcbiAgICAgIHBvcnQ6IDgwLFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgfSk7XHJcblxyXG4gICAgLy8gcnVuIGhlbGxvU2VydmljZSBkZWZpbmVkIGFib3ZlIGFuZCBleHBvc2Ugb24gcG9ydCA4MFxyXG4gICAgZXh0ZXJuYWxMaXN0ZW5lci5hZGRUYXJnZXRzKCdncmVldGVyJywge1xyXG4gICAgICBwb3J0OiA4MCxcclxuICAgICAgdGFyZ2V0czogW2hlbGxvU2VydmljZV0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBleHRlcm5hbCBVUkwgZm9yIGV4cG9zZWQgcG9ydFxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgJ0V4dGVybmFsRE5TJywge1xyXG4gICAgICB2YWx1ZTogZXh0ZXJuYWxMQi5sb2FkQmFsYW5jZXJEbnNOYW1lLFxyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcbiJdfQ==