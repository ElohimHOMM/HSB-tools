import { Flyway } from "node-flyway";

const flyway = new Flyway(
    {
        url:"jdbc:postgresql://localhost:5432/postgres",
        user:"postgres",
        password:"password",
        defaultSchema: "public",
        migrationLocations: ["src/migrations"]
    }
);


flyway.migrate().then(response => {
    if(!response.success) {
      // Handle failure case
      throw new Error(`Unable to execute migrate command. Error: ${response.error.errorCode}`);
    }
    else {
      // Handle response
    }
});