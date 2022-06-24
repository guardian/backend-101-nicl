import { App } from 'aws-cdk-lib';
import { MyStack } from './stack';

// Use this file to instantiate your stacks.

const app = new App();

new MyStack(app, 'backend-101-nicl', {
	stack: 'deploy',
	stage: 'CODE',
});