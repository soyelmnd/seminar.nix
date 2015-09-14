501px
=====
So this is an art website of photographers, called the 501px.
Note that it's not a 500px parody.


## 1. The very first step

### 1.1. User account
Setup your user account with the following details
* username: your email (drop the @offspringdigital.com)
* password: freely pick it
* home directory: /home/{user-name}
Then use it to ssh.

### 1.2. Upload sourcecode
Upload sourcecode to `/home/{user-name}/www`. There are several ways to make it
1. scp
2. rsync
3. ftp (need to setup first, `vsftpd` is recommended)

### 1.3. Setup apache & mysql
Setup apache site (via virtual host)
* Port 80
* DocumentRoot `home/{user-name}/www`
* Run as user `apache`
* Run as group `www` (should create `www` group)

Import SQL database
* database name: `501px`
* sql file at `home/{user-name}/www/res/db/init.sql`
* note that we haven't got any GUI tool
* actually, it's just a dummy task

### 1.4. Config the build
Symlink to make `res` available as `/home/{user-name}/public/res`.
Using `ln`.

Change all the files/folders ownerships to {user-name}/www (user {user-name}
and group www). Make the mod so that owner-user can fully read+write, the
owner-group can read, and others can do nothing (no read, no write)>

Make all the files to-be-created `res/photos/` has the same ownership
({user-name}/www). Hint: that's sticky bit, `chmod +s`. Also, the `res/photos/`
folder has to be writable by the `www` group, so that we'll implement the
upload feature later.

Exec the spider, and wait
```bash
  cd /home/{user-name}/www
  sudo npm link
  501px-crawl
```

### 1.5. Setup cronjob for the spider
Let's make the `501px-crawl` runs every 2 minutes.
Please see [http://code.tutsplus.com/tutorials/scheduling-tasks-with-cron-jobs--net-8800]()


## 2. Testing it

### 2.1. Tunnel to outside
As we don't have a nice domain name point to the playgrounds, let's make it
`ngrok`ed. Just type
```bash
ngrok http 8080 -subdomain=of-{user-name}
```

### 2.2. Benchmark via Google's Page Speed Insight
Or use the already installed `psi` cli tool

## 3. Improve

### 3.1  Nginx as a simple gateway
