const {request, response} = require('express');
const usersModel = require('../models/users');
const pool = require('../db');

const listUsers = async (req = request, res = response) => {
    let conn;

    try{
        conn =  await pool.getConnection();

        const users = await conn.query(usersModel.getAll,(err)=>{
            if (err){
                throw err;
            }
        })
        res.json(users);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end()
        }
    }
}

const listUsersByID = async (req = request, res = response) => {
    const {id} = req.params;
    let conn;

    if (isNaN(id)){
        res.status(400).json ({msg: `The ID ${id} is invalid`});
        return;
    }

    try{
        conn =  await pool.getConnection();

        const [user] = await conn.query(usersModel.getByID, [id] ,(err)=>{
            if (err){
                throw err;
            }
        })

        if (!user){
            res.status(404).json({msg: `User with ID ${id} not found`});
            return;
        }

        res.json(user);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end();
        }
    }
}

const addUser = async (req = request, res = response) =>{
    const {
        username,
        password,
        email,
        name,
        lastname,
        phonenumber = '',
        role_id,
        is_active = 1
    } = req.body;

    if (!username || !password || !email || !name || !lastname || !role_id){
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = [username,passwordHash,email,name,lastname,phonenumber,role_id,is_active];

    let conn;

    try{
        conn = await pool.getConnection();

        const [usernameExists] = await conn.query(usersModel.getByUsername,[username],(err)=>{
            if (err) throw err;
        })
        if (usernameExists){
            res.status(409).json({msg: `Username ${username} already exists`});
            return;
        }

        const [emailExists] = await conn.query(usersModel.getByEmail,[email],(err)=>{
            if (err) throw err;
        })
        if (emailExists){
            res.status(409).json({msg: `Email ${email} already exists`});
            return;
        }

        const userAdded = await conn.query(usersModel.addRow,[...user], (err)=>{
            if (err) throw err;
        })

        if (userAdded.affectedRows === 0){
            throw new Error('User not Added');
        }
        
        res.json({msg: 'User added succesfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}

//Aqui va la para actualizar un usuario si existe
const updateUser = async (req = request, res = response) => {
    let conn;

    const {
        username,
        password,
        email,
        name,
        lastname,
        phonenumber,
        role_id,
        is_active
    } = req.body;

    const { id } = req.params;

    if (isNaN(id)){
        res.status(400).json ({msg: `The ID ${id} is invalid`});
        return;
    }
    
    let passwordHash;
    if (password){
        const saltRounds = 10;
        passwordHash = await bcrypt.hash(password, saltRounds);
    }

    let userNewData = [
        username,
        passwordHash,
        email,
        name,
        lastname,
        phonenumber,
        role_id,
        is_active
    ];

    try {
        conn = await pool.getConnection();

const [userExists] = await conn.query
(usersModel.getByID, 
    [id], 
    (err) => {
    if (err) throw err;
});

if (!userExists || userExists.is_active ===0){
    res.status(409).json({msg: `User with ID ${id} not found`});
         return;
}

const [usernameExists] = await conn.query(usersModel.getByUsername, [username], (err) => {
    if (err) throw err;
    })
    if (usernameExists) {
        res.status(409).json({msg: `Username ${username} already exists`});
        return;
       }

const [emailExists] = await conn.query(usersModel.getByEmail, [email], (err) => {
      if (err) throw err;
     })
      if (emailExists) {
          res.status(409).json({msg: `Email ${email} already exists`});
         return;
           }

        const userOldData = [
        userExists.username,
        userExists.password,
        userExists.email,
        userExists.name,
        userExists.lastname,
        userExists.phonenumber,
        userExists.role_id,
        userExists.is_active     
      ];

      userNewData.forEach((userData, index) =>{
        if (!userData){
            userNewData[index] = userOldData[index];
        }
      })
           const userUpdated = await conn.query(
            usersModel.updateRow,
            [...userNewData, id],
            (err) =>{
                if (err) throw err;
            }
           )

 if (userUpdated.affecteRows === 0){
   throw new Error('User not added')
        } 

        res.json({msg: 'USER ADDED SECCESFULLY'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    } finally {
        if (conn) conn.end();
    }
}

const deleteUser = async (req = request, res = response) =>{
    let conn;
    const {id} = req.params;

    if (isNaN(id)){
        res.status(400).json ({msg: `The ID ${id} is invalid`});
        return;
    }

    try{
        conn = await pool.getConnection();
        const [usersExists] = await conn.query(usersModel.getByID,[id], (err) =>{
            if (err) throw err;
        });
        if (!usersExists || usersExists.is_active === 0){
            res.status(404).json({msg: `User with ID ${id} not found`});
            return;
        }
        const usersDeleted = await conn.query(usersModel.deleteRow,[id],(err) =>{
            if (err) throw err;
        });
        
        if (usersDeleted.affectedRows === 0){
            throw new Error('User not deleted');
        }

        res.json({msg:'User deleted succesfully'});

    }catch (error){
        console.log(error);
        res.status(500).json(error);
    }finally {
        if (conn) conn.end();
    }
}

//
const signInuser = async (req = request, res = response) =>{
    let conn;

    const {username, password} = req.body;

    try {
    conn  = await pool.getConnection();

        if (!username || !password){
            res.status(400).json({msg: 'You must send Username and password'});
            return;
        }
    
        const [user] =  await conn.query(usersModel.getByUsername, 
            [username], 
            (err) => {
            if(err)throw err;
        });
    
        if (!user){
            res.status(404).json({msg: `Wrong username or password`});
            return;
        }
    
    
        if(!passwordOk){
            res.status(404).json({msg: `Wrong username or password`});
            return;
        }

        delete(user.password);
        delete(user.create_at);
        delete(user.updated_at);

        res.json(user);

    }catch(error){
        console.log(error);
        res.status(500).json(error);
    }finally{
        if (conn) conn.end();
    }
}

module.exports = {
    listUsers, 
    listUsersByID, 
    addUser, 
    updateUser,
    deleteUser,
    signInuser
    }

// routes       controllers       models(DB)