import type { GuStackProps } from '@guardian/cdk/lib/constructs/core';
import { GuStack } from '@guardian/cdk/lib/constructs/core';
import { App, Duration } from 'aws-cdk-lib';
import { GuEc2App} from '@guardian/cdk';
import { GuCname } from '@guardian/cdk/lib/constructs/dns';
import { AccessScope } from '@guardian/cdk/lib/constants';
import { InstanceClass, InstanceSize, InstanceType } from 'aws-cdk-lib/aws-ec2';

export class MyStack extends GuStack {
	constructor(scope: App, id: string, props: GuStackProps) {
		super(scope, id, props);

		const name = "backend-101-nicl";
		const domainName = `${name}.gutools.co.uk`;
		const bucket = "deploy-tools-dist";
		const keyPrefix = `${this.stack}/${this.stage}/${name}`;

		// In a 'real' example, we would want to use a non-root user etc. But
		// this is enough for now.
		const userData = `#!/bin/bash -ev
aws s3 cp s3://${bucket}/${keyPrefix}/app.service /etc/systemd/system/${name}.service
aws s3 cp s3://${bucket}/${keyPrefix}/hello-world.jar /hello-world.jar
systemctl start ${name}
`;

		const app = new GuEc2App(this, {
			applicationPort: 9000,
			app: name,
			access: { scope: AccessScope.PUBLIC },
			instanceType: InstanceType.of(InstanceClass.T4G, InstanceSize.SMALL),
			monitoringConfiguration: { noMonitoring: true},
			scaling: { minimumInstances: 1, maximumInstances: 2},
			userData: userData,
			certificateProps: {
				domainName,
			},
		});

		new GuCname(this, "dns", {
			app: name,
			domainName,
			ttl: Duration.minutes(1),
			resourceRecord: app.loadBalancer.loadBalancerDnsName,
		});
	}
}
