TEMPLATE_YML=template.yml

watch:
	npm run watch

synth:	aws-prereqs
	npx cdk synth --no-staging > $(TEMPLATE_YML)

aws-prereqs:
	bash scripts/aws-prereqs.sh

bootstrap:	aws-prereqs
	npx cdk bootstrap

diff:	bootstrap
	npx cdk diff

deploy-infra:	bootstrap
	npx cdk deploy --require-approval never

deploy-frontend:
	bash scripts/deploy-frontend.sh

install:
	npm install

install-backend:
	cd mljsapi && npm install

install-frontend:
	cd madliberationjs && npm install

build:
	npm run build

tests:
	npm test
