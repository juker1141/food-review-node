DB_URL=postgresql://postgres:password@localhost:5432/food_review?sslmode=disable

postgres:
	docker run --name postgres -p 5432:5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -d postgres:15.3-alpine

createdb:
	docker exec -it postgres createdb -U postgres -O postgres food_review

dropdb:
	docker exec -it postgres dropdb -U postgres food_review

migrateup:
	npx sequelize-cli db:migrate

migratedown:
	npx sequelize-cli db:migrate:undo:all


.PHONY: postgres createdb dropdb migrateup migratedown