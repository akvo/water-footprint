# Water Footprint

## Requirements

- [Docker Compose](https://docs.docker.com/compose/)

## Getting Started

1. **Start the development environment:**

   ```sh
   docker compose up --build -d
   ```

2. **Register the first administrator user:** (Ensure Strapi is running)

   ```sh
   docker compose exec backend npm run strapi admin:create -- -f <Firstname> -e <Email> -p <Password>
   ```

3. **Sync Strapi configurations:** (Stored in the database)

   ```sh
   docker compose exec backend npm run config-sync import -- -y
   ```

## Available Services

- **Frontend (Next.js):** http://localhost:3000
- **Backend (Strapi):** http://localhost:1337
- **pgAdmin4:** http://localhost:5050
- **Mailpit:** http://localhost:8025

## Useful Commands

- **Monitor container logs:**

  ```sh
  docker compose logs -f <container_name>
  ```

- **Stop the development environment:**

  ```sh
  docker compose down
  ```

- **Stop and clean up all data:** (Use `-v` to remove volumes)

  ```sh
  docker compose down -v
  ```

## Managing User Roles and Email Notifications

### User Roles

Strapi supports different user roles with varying permissions. By default, the system includes:

- **Super Admin**: Has access to all features and settings
- **Editor**: Can create and manage content
- **Author**: Can create but has limited management capabilities

### Creating and Managing Users

1. Log in to the Strapi admin panel at http://localhost:1337/admin
2. Navigate to Settings > Administration Panel > Users
3. Click "Invite new user" to add a new administrator
4. Specify their information and select a role

### Configuring Email Notifications

Contact form submissions and system notifications can be directed to specific user roles:

1. To modify which roles receive contact form submissions:

   - Edit the contact form controller at `backend/src/api/contact/controllers/contact.js`
   - Update the query condition to target specific roles:

   ```javascript
   // Send to editors only (default)
   const recipients = await strapi.db.query('admin::user').findMany({
     where: {
       isActive: true,
       blocked: false,
       roles: {
         code: 'editor',
       },
     },
   });

   // Send to super admins only
   const recipients = await strapi.db.query('admin::user').findMany({
     where: {
       isActive: true,
       blocked: false,
       roles: {
         code: 'super-admin',
       },
     },
   });

   // Send to both editors and authors
   const recipients = await strapi.db.query('admin::user').findMany({
     where: {
       isActive: true,
       blocked: false,
       roles: {
         code: {
           $in: ['editor', 'author'],
         },
       },
     },
   });
   ```

2. After modifying the controller, restart the backend service:
   ```sh
   docker compose restart backend
   ```

## Technical Notes

### Strapi Configuration Sync

#### Background

Strapi stores configurations both in files and the database. Database-stored configurations need to
be version-controlled and easily transferable between environments. This project uses the
[config-sync](https://market.strapi.io/plugins/strapi-plugin-config-sync) plugin for this purpose.

For more information, see the [config-sync documentation](https://docs.pluginpal.io/config-sync).

#### User Interface

Access the config sync interface via the Strapi admin panel: **Settings > Config Sync > Interface**
or directly at `<BACKEND_URL>/admin/settings/config-sync`.

#### Command Line

```sh
docker compose exec backend npm run config-sync help
```

#### Sync Workflow

##### During Development

- **Import:** After pulling changes from the repository, import the configuration to apply changes made
  by other developers.
- **Export:** After making configuration changes in the admin panel, export the configuration and commit
  it to Git. Submit a pull request (PR).

##### After Deployment

- **Import:** Immediately import the configuration after deployment. Ensure no configuration changes are
  made directly on the target server.
- **Export and Download:** After making configuration changes, export and download the configuration then
  commit it to the repository. The server configuration will be synced on the next deployment.

### Using External Services

The project uses external services like an SMTP server sending emails.

For development efficiency, these external services are not required. The development server uses local
services by default. To test integration with external services:

- Copy `.env.example` to `.env`.
- Set `PLUGIN_PROVIDERS=external`.
- Fill in the required SMTP service variables.
- Restart the development environment.
