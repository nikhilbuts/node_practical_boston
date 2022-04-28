const db_config = function () {
    
   
    this.live_url = "http://localhost:3000";

   // test database local
   this.localdatabase = 'node-practical-boston';
   this.localusername = null;
   this.localpassword = null;
   this.localhost = 'localhost';
   this.localport = '27017';
   this.localauthSource = 'node-practical-boston';
};

module.exports = new db_config();