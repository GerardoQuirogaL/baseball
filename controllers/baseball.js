const {request, response} = require('express');
const baseballModel = require('../models/baseball');
const pool = require('../db');

//1
const listbaseball = async (req = request, res = response) => {
    let conn;

    try{
        conn =  await pool.getConnection();

        const baseball = await conn.query(baseballModel.getAll,(err)=>{
            if (err){
                throw err;
            }
        })
        res.json(baseball);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end()
        }
    }
}

//2
const baseballByID = async (req = request, res = response) => {
    const {park} = req.params;
    let conn;

    if (isNaN(park)){
        res.status(400).json ({msg: `The park ${park} is invalid`});
        return;
    }

    try{
        conn =  await pool.getConnection();
        const [parkID] = await conn.query(baseballModel.getByPARK,[park] ,(err)=>{
            if (err){
                throw err;
            }
        })

        if (!parkID){
            res.status(404).json({msg: `User with ID ${park} not found`});
            return;
        }

        res.json(parkID);
    } catch (error){
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn){
            conn.end();
        }
    }
}

//3
const addpark = async (req = request, res = response) =>{
    const {
            park,
            NAME,
            Cover,
            LF_Dim,
            CF_Dim,
            RF_Dim,
            LF_W,
            CF_W,
            RF_W
    } = req.body;

    if ( !park || !NAME || !Cover || !LF_Dim || !CF_Dim || !RF_Dim || !LF_W || !CF_W || !RF_W)
    {
        res.status(400).json({msg: 'Missing information'});
        return;
    }

    const Park = [
            park,
            NAME,
            Cover,
            LF_Dim,
            CF_Dim,
            RF_Dim,
            LF_W,
            CF_W,
            RF_W
    ]
    let conn;

    try{
        conn = await pool.getConnection();

        const [NAMEExists] = await conn.query(baseballModel.getByNAME,[NAME],(err)=>{
            if (err) throw err;
        })
        if (NAMEExists){//
            res.status(409).json({msg: `NAME ${NAME} already exists`});
            return;
        }

        const NAMEAdded = await conn.query(baseballModel.addRow,[...Park], (err)=>{
            if (err) throw err;
        })

        if (NAMEAdded.affectedRows === 0){
            throw new Error('Name not Added');
        }
        
        res.json({msg: 'Name added succesfully'})
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    } finally{
        if (conn) conn.end();
    }
}

// 4 Aqui va la para actualizar un usuario si existe
const updateName_Park = async (req = request, res = response) => {
    let conn;

    const {
            
            NAME,
            Cover,
            LF_Dim,
            CF_Dim,
            RF_Dim,
            LF_W,
            CF_W,
            RF_W
    } = req.body;

    const { park } = req.params;

    let NewData = [
            
            NAME,
            Cover,
            LF_Dim,
            CF_Dim,
            RF_Dim,
            LF_W,
            CF_W,
            RF_W
    ];

    try {
        conn = await pool.getConnection();

const [PARKExists] = await conn.query
(baseballModel.getByPARK, 
    [park], 
    (err) => {
    if (err) throw err;
});

if (!PARKExists){
    res.status(409).json({msg: `User with ID ${park} not found`});
         return;//
}

const [NameExists] = await conn.query(baseballModel.getByNAME, [NAME], (err) => {
    if (err) throw err;
    })
    if (NameExists) {
        res.status(409).json({msg: `NAME ${NameExists} already exists`});
        return;
       }

        const NamesOldData = [
        
        PARKExists.NAME,
        PARKExists.Cover,
        PARKExists.LF_Dim,
        PARKExists.CF_Dim,
        PARKExists.RF_Dim,
        PARKExists.LF_W,
        PARKExists.CF_W,
        PARKExists.RF_W    
      ];

      NewData.forEach((parkData, index) =>{
        if (!parkData){
            NewData[index] = NamesOldData[index];
        }
      })
           const nameUpdated = await conn.query(
            baseballModel.updateRow,
            [...NewData, park],
            (err) =>{
                if (err) throw err;
            }
           )

 if (nameUpdated.affectedRows === 0){ //corregi
   throw new Error('Name not added')
        } 

        res.json({msg: 'NAME ADDED SECCESFULLY'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
        return;
    } finally {
        if (conn) conn.end();
    }
}
//5
const deleteBaseball = async (req = request, res = response) =>{
    let conn;
    const {park} = req.params;

    try{
        conn = await pool.getConnection();
        const [NameExists] = await conn.query(baseballModel.getByPARK,[park], (err) =>{
            if (err) throw err;
        });
        if (!NameExists || NameExists.is_active === 0){
            res.status(404).json({msg: `User with park ${park} not found`});
            return;
        }
        const parkDeleted = await conn.query(baseballModel.deleteRow,[park],(err) =>{
            if (err) throw err;
        });
        
        if (parkDeleted.affectedRows === 0){
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

module.exports = {
    listbaseball, 
    baseballByID, 
    addpark, 
    updateName_Park,
    deleteBaseball
    }

// routes       controllers       models(DB)