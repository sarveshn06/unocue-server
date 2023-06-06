/*
 * Copyright (c) Akveo 2019. All Rights Reserved.
 * Licensed under the Single Application / Multi Application License.
 * See LICENSE_SINGLE_APP / LICENSE_MULTI_APP in the 'docs' folder for license information on type of purchased license.
 */

const { ObjectID } = require('mongodb');
const BaseRepository = require('../../../db/baseRepository');
const models = require( '../../../models/index');
const {Op}=require('sequelize')
class UserRepository extends BaseRepository {
  constructor() {
    super('users');
  }

  findById(id) {
    return models.users.findByPk(id);
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //     .aggregate([
    //       { $match: { _id: ObjectID(id) } },
    //       {
    //         $lookup: {
    //           from: 'settings',
    //           localField: '_id',
    //           foreignField: '_id',
    //           as: 'settings',
    //         },
    //       },
    //       { $limit: 1 },
    //     ])
    //     .toArray())
    //   .then(data => (data && data.length ? data[0] : data));
  }

  findByEmail(email) {
    return models.users.findOne({ where: { email: email } });
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //     .findOne({ email }));
  }

  findByEmailOrPhone(data){
    return models.users.findOne({ where: { [Op.or]: [{email:data}, {phone_number:data}]} });
  }

  findByMobile(phone_number) {
    return models.users.findOne({ where: { phone_number: phone_number } });
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //     .findOne({ email }));
  }

  findAllUsersByEmail(email) {
    return models.users.findAll({ where: { email: email } });
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //     .find({ email })
    //     .toArray());
  }

  changePassword(id, salt, passwordHash) {
    const item={
       passwordHash:passwordHash,
       salt:salt
     }
     return models.users.update(item, {
       where: {
         id :id
       }})
     // return this.dbClient
     //   .then(db => db
     //     .collection(this.collection)
     //     .updateOne({ _id: ObjectID(id) }, { $set: { salt, passwordHash } }));
  }

  listFiltered(filter) {
    const listFilter = this._getListFilter(filter);

    return super.listFiltered(listFilter);
  }

  getCountFiltered(filter) {
    const listFilter = this._getListFilter(filter);

    return super.getCountFiltered(listFilter);
  }

  _getListFilter(filter) {
    const copyFilter = { ...filter };

    copyFilter.query = {};

    // names here are not fully consistent with naming convention for compatibility with ng2-smart-table api on UI
    if (copyFilter.filterByfirstName) {
      copyFilter.query.firstName = { $regex: copyFilter.filterByfirstName, $options: '-i' };
    }
    if (copyFilter.filterBylastName) {
      copyFilter.query.lastName = { $regex: copyFilter.filterBylastName, $options: '-i' };
    }
    if (copyFilter.filterBylogin) {
      copyFilter.query.fullName = { $regex: copyFilter.filterBylogin, $options: '-i' };
    }
    if (copyFilter.filterByemail) {
      copyFilter.query.email = { $regex: copyFilter.filterByemail, $options: '-i' };
    }
    if (copyFilter.filterByage) {
      copyFilter.query.age = copyFilter.filterByage;
    }
    if (copyFilter.filterBystreet) {
      copyFilter.query['address.street'] = { $regex: copyFilter.filterBystreet, $options: '-i' };
    }
    if (copyFilter.filterBycity) {
      copyFilter.query['address.city'] = { $regex: copyFilter.filterBycity, $options: '-i' };
    }
    if (copyFilter.filterByzipcode) {
      copyFilter.query['address.zipCode'] = { $regex: copyFilter.filterByzipcode, $options: '-i' };
    }

    return copyFilter;
  }

  // TODO: implement photo return
  getPhoto(userId) {
    const defaultFileName = 'default-img.jpg';

    return Promise.resolve(defaultFileName);
    // return this.dbClient
    //   .then(db => db
    //     .collection(this.collection)
    //   )
  }

  editCurrentUserToken(id,item){
    return models.users.update({verification_token:item.verification_token},{
      where:{
        id:id
      }
    })
  }

  subscription(userId){

   return models.Company_Subscription.findOne({
    where:{
      user_id:userId
    }
   }).then(data=>{
    if(data){
      const today=new Date();
      if(today < new Date(data.end_date)){
        return true
      }else{
        return false
      }
    }
   })

  }
}

module.exports = UserRepository;
