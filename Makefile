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

deploy:	bootstrap
	npx cdk deploy --require-approval never

install: |
	npm install
	cd mljsapi
	npm install

build:
	npm run build

tests:
	npm test
