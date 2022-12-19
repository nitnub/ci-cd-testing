"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Awsec3ExpressDockerStack = void 0;
const core_1 = require("@aws-cdk/core");
const aws_ec2_1 = require("@aws-cdk/aws-ec2");
const aws_ecs_1 = require("@aws-cdk/aws-ecs");
const aws_elasticloadbalancingv2_1 = require("@aws-cdk/aws-elasticloadbalancingv2");
/**
 * Enter DockerHub path here (example -> nitnub/ci-cd-testing)
 */
const dockerHubPath = 'nitnub/ci-cd-testing';
class Awsec3ExpressDockerStack extends core_1.default.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        // Virtual Private Cloud
        const vpc = new aws_ec2_1.default.Vpc(this, "helloVpc", { maxAzs: 2 });
        // Create an ECS cluster
        var cluster = new aws_ecs_1.default.Cluster(this, "Cluster", { vpc });
        cluster.addCapacity("DefaultAutoScalingGroup", {
            instanceType: new aws_ec2_1.default.InstanceType("t2.micro"),
            maxCapacity: 3,
        });
        // hello service
        const helloTaskDefinition = new aws_ecs_1.default.Ec2TaskDefinition(this, "hello-task-definition", {});
        // Spinning up containers and pulling image from docker hub
        const helloContainer = helloTaskDefinition.addContainer("hello", {
            image: aws_ecs_1.default.ContainerImage.fromRegistry(dockerHubPath),
            memoryLimitMiB: 128,
        });
        helloContainer.addPortMappings({
            containerPort: 3000,
        });
        const helloService = new aws_ecs_1.default.Ec2Service(this, "hello-service", {
            cluster: cluster,
            desiredCount: 3,
            taskDefinition: helloTaskDefinition,
        });
        // Internet facing load balancer for the frontend services
        const externalLB = new aws_elasticloadbalancingv2_1.default.ApplicationLoadBalancer(this, "external", {
            vpc: vpc,
            internetFacing: true,
        });
        const externalListener = externalLB.addListener("PublicListener", {
            port: 80,
            open: true,
        });
        // run helloService defined above and expose on port 80
        externalListener.addTargets("greeter", {
            port: 80,
            targets: [helloService],
        });
        // external URL for exposed port
        new core_1.default.CfnOutput(this, "ExternalDNS", {
            value: externalLB.loadBalancerDnsName,
        });
    }
}
exports.Awsec3ExpressDockerStack = Awsec3ExpressDockerStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYXdzZWMzX2V4cHJlc3NfZG9ja2VyLXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHdDQUFnQztBQUNoQyw4Q0FBbUM7QUFDbkMsOENBQW1DO0FBQ25DLG9GQUF3RDtBQUV4RDs7R0FFRztBQUVILE1BQU0sYUFBYSxHQUFHLHNCQUFzQixDQUFBO0FBRzVDLE1BQWEsd0JBQXlCLFNBQVEsY0FBRyxDQUFDLEtBQUs7SUFDckQsWUFBWSxLQUFjLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRXhCLHdCQUF3QjtRQUN4QixNQUFNLEdBQUcsR0FBRyxJQUFJLGlCQUFHLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxVQUFVLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUV6RCx3QkFBd0I7UUFDeEIsSUFBSSxPQUFPLEdBQUcsSUFBSSxpQkFBRyxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsU0FBUyxFQUFFLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQztRQUN4RCxPQUFPLENBQUMsV0FBVyxDQUFDLHlCQUF5QixFQUFFO1lBQzdDLFlBQVksRUFBRSxJQUFJLGlCQUFHLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQztZQUM5QyxXQUFXLEVBQUUsQ0FBQztTQUNmLENBQUMsQ0FBQztRQUVILGdCQUFnQjtRQUNoQixNQUFNLG1CQUFtQixHQUFHLElBQUksaUJBQUcsQ0FBQyxpQkFBaUIsQ0FDbkQsSUFBSSxFQUNKLHVCQUF1QixFQUN2QixFQUFFLENBQ0gsQ0FBQztRQUNGLDJEQUEyRDtRQUMzRCxNQUFNLGNBQWMsR0FBRyxtQkFBbUIsQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFO1lBQy9ELEtBQUssRUFBRSxpQkFBRyxDQUFDLGNBQWMsQ0FBQyxZQUFZLENBQUMsYUFBYSxDQUFDO1lBQ3JELGNBQWMsRUFBRSxHQUFHO1NBQ3BCLENBQUMsQ0FBQztRQUVILGNBQWMsQ0FBQyxlQUFlLENBQUM7WUFDN0IsYUFBYSxFQUFFLElBQUk7U0FDcEIsQ0FBQyxDQUFDO1FBRUgsTUFBTSxZQUFZLEdBQUcsSUFBSSxpQkFBRyxDQUFDLFVBQVUsQ0FBQyxJQUFJLEVBQUUsZUFBZSxFQUFFO1lBQzdELE9BQU8sRUFBRSxPQUFPO1lBQ2hCLFlBQVksRUFBRSxDQUFDO1lBQ2YsY0FBYyxFQUFFLG1CQUFtQjtTQUNwQyxDQUFDLENBQUM7UUFDSCwwREFBMEQ7UUFFMUQsTUFBTSxVQUFVLEdBQUcsSUFBSSxvQ0FBSyxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxVQUFVLEVBQUU7WUFDckUsR0FBRyxFQUFFLEdBQUc7WUFDUixjQUFjLEVBQUUsSUFBSTtTQUNyQixDQUFDLENBQUM7UUFFSCxNQUFNLGdCQUFnQixHQUFHLFVBQVUsQ0FBQyxXQUFXLENBQUMsZ0JBQWdCLEVBQUU7WUFDaEUsSUFBSSxFQUFFLEVBQUU7WUFDUixJQUFJLEVBQUUsSUFBSTtTQUNYLENBQUMsQ0FBQztRQUVILHVEQUF1RDtRQUN2RCxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFO1lBQ3JDLElBQUksRUFBRSxFQUFFO1lBQ1IsT0FBTyxFQUFFLENBQUMsWUFBWSxDQUFDO1NBQ3hCLENBQUMsQ0FBQztRQUVILGdDQUFnQztRQUNoQyxJQUFJLGNBQUcsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRTtZQUNyQyxLQUFLLEVBQUUsVUFBVSxDQUFDLG1CQUFtQjtTQUN0QyxDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUExREQsNERBMERDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNkayBmcm9tIFwiQGF3cy1jZGsvY29yZVwiO1xyXG5pbXBvcnQgZWMyIGZyb20gXCJAYXdzLWNkay9hd3MtZWMyXCI7XHJcbmltcG9ydCBlY3MgZnJvbSBcIkBhd3MtY2RrL2F3cy1lY3NcIjtcclxuaW1wb3J0IGVsYnYyIGZyb20gXCJAYXdzLWNkay9hd3MtZWxhc3RpY2xvYWRiYWxhbmNpbmd2MlwiO1xyXG5cclxuLyoqXHJcbiAqIEVudGVyIERvY2tlckh1YiBwYXRoIGhlcmUgKGV4YW1wbGUgLT4gbml0bnViL2NpLWNkLXRlc3RpbmcpXHJcbiAqL1xyXG5cclxuY29uc3QgZG9ja2VySHViUGF0aCA9ICduaXRudWIvY2ktY2QtdGVzdGluZydcclxuXHJcblxyXG5leHBvcnQgY2xhc3MgQXdzZWMzRXhwcmVzc0RvY2tlclN0YWNrIGV4dGVuZHMgY2RrLlN0YWNrIHtcclxuICBjb25zdHJ1Y3RvcihzY29wZTogY2RrLkFwcCwgaWQ6IHN0cmluZywgcHJvcHM/OiBjZGsuU3RhY2tQcm9wcykge1xyXG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XHJcblxyXG4gICAgLy8gVmlydHVhbCBQcml2YXRlIENsb3VkXHJcbiAgICBjb25zdCB2cGMgPSBuZXcgZWMyLlZwYyh0aGlzLCBcImhlbGxvVnBjXCIsIHsgbWF4QXpzOiAyIH0pO1xyXG5cclxuICAgIC8vIENyZWF0ZSBhbiBFQ1MgY2x1c3RlclxyXG4gICAgdmFyIGNsdXN0ZXIgPSBuZXcgZWNzLkNsdXN0ZXIodGhpcywgXCJDbHVzdGVyXCIsIHsgdnBjIH0pO1xyXG4gICAgY2x1c3Rlci5hZGRDYXBhY2l0eShcIkRlZmF1bHRBdXRvU2NhbGluZ0dyb3VwXCIsIHtcclxuICAgICAgaW5zdGFuY2VUeXBlOiBuZXcgZWMyLkluc3RhbmNlVHlwZShcInQyLm1pY3JvXCIpLFxyXG4gICAgICBtYXhDYXBhY2l0eTogMyxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIGhlbGxvIHNlcnZpY2VcclxuICAgIGNvbnN0IGhlbGxvVGFza0RlZmluaXRpb24gPSBuZXcgZWNzLkVjMlRhc2tEZWZpbml0aW9uKFxyXG4gICAgICB0aGlzLFxyXG4gICAgICBcImhlbGxvLXRhc2stZGVmaW5pdGlvblwiLFxyXG4gICAgICB7fVxyXG4gICAgKTtcclxuICAgIC8vIFNwaW5uaW5nIHVwIGNvbnRhaW5lcnMgYW5kIHB1bGxpbmcgaW1hZ2UgZnJvbSBkb2NrZXIgaHViXHJcbiAgICBjb25zdCBoZWxsb0NvbnRhaW5lciA9IGhlbGxvVGFza0RlZmluaXRpb24uYWRkQ29udGFpbmVyKFwiaGVsbG9cIiwge1xyXG4gICAgICBpbWFnZTogZWNzLkNvbnRhaW5lckltYWdlLmZyb21SZWdpc3RyeShkb2NrZXJIdWJQYXRoKSxcclxuICAgICAgbWVtb3J5TGltaXRNaUI6IDEyOCxcclxuICAgIH0pO1xyXG5cclxuICAgIGhlbGxvQ29udGFpbmVyLmFkZFBvcnRNYXBwaW5ncyh7XHJcbiAgICAgIGNvbnRhaW5lclBvcnQ6IDMwMDAsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBoZWxsb1NlcnZpY2UgPSBuZXcgZWNzLkVjMlNlcnZpY2UodGhpcywgXCJoZWxsby1zZXJ2aWNlXCIsIHtcclxuICAgICAgY2x1c3RlcjogY2x1c3RlcixcclxuICAgICAgZGVzaXJlZENvdW50OiAzLFxyXG4gICAgICB0YXNrRGVmaW5pdGlvbjogaGVsbG9UYXNrRGVmaW5pdGlvbixcclxuICAgIH0pO1xyXG4gICAgLy8gSW50ZXJuZXQgZmFjaW5nIGxvYWQgYmFsYW5jZXIgZm9yIHRoZSBmcm9udGVuZCBzZXJ2aWNlc1xyXG5cclxuICAgIGNvbnN0IGV4dGVybmFsTEIgPSBuZXcgZWxidjIuQXBwbGljYXRpb25Mb2FkQmFsYW5jZXIodGhpcywgXCJleHRlcm5hbFwiLCB7XHJcbiAgICAgIHZwYzogdnBjLFxyXG4gICAgICBpbnRlcm5ldEZhY2luZzogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGV4dGVybmFsTGlzdGVuZXIgPSBleHRlcm5hbExCLmFkZExpc3RlbmVyKFwiUHVibGljTGlzdGVuZXJcIiwge1xyXG4gICAgICBwb3J0OiA4MCxcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgIH0pO1xyXG5cclxuICAgIC8vIHJ1biBoZWxsb1NlcnZpY2UgZGVmaW5lZCBhYm92ZSBhbmQgZXhwb3NlIG9uIHBvcnQgODBcclxuICAgIGV4dGVybmFsTGlzdGVuZXIuYWRkVGFyZ2V0cyhcImdyZWV0ZXJcIiwge1xyXG4gICAgICBwb3J0OiA4MCxcclxuICAgICAgdGFyZ2V0czogW2hlbGxvU2VydmljZV0sXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBleHRlcm5hbCBVUkwgZm9yIGV4cG9zZWQgcG9ydFxyXG4gICAgbmV3IGNkay5DZm5PdXRwdXQodGhpcywgXCJFeHRlcm5hbEROU1wiLCB7XHJcbiAgICAgIHZhbHVlOiBleHRlcm5hbExCLmxvYWRCYWxhbmNlckRuc05hbWUsXHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19