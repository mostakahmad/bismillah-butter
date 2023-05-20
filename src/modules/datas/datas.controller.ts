import { NextFunction, Request, Response } from "express";
import config from "config";
import { datasService } from ".";
import { ApiError } from "../../errors";
import { IAuditTrail, IDatas } from "./datas.interfaces";
import { string } from "joi";


const getAllDatas = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID } = req.query;
    const datas = await datasService.findAllByQuery({userID});
    let totalPurchase = 0;
    let totalSell = 0;
    datas.forEach((item: any) => {
      item.totalPurchase = 0;
      item.totalSell = 0;
      if (item.purchase.length > 0) {
        item.purchase.forEach((it: any) => {
          item.totalPurchase += it.price;
        })
      }
      if (item.sell.length > 0) {
        item.sell.forEach((it: any) => {
          item.totalSell += it.price;
        })
      }
      totalPurchase += item.totalPurchase;
      totalSell += item.totalSell;
    });

    return res.status(200).send({
      success: true,
      data: {
        datas: datas,
        totalPurchase: totalPurchase,
        totalSell: totalSell
      },
    });
  } catch (error) {
    next(error);
  }
};

const filterData = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let { userID, fromData, toData, customer } = req.body;
    
    let query = {};
    
    if((!fromData || !toData) && customer != 'all'){
      query = {  userID :userID, company : customer }
    } 
    else if((!fromData || !toData) && customer == 'all'){
      query = { userID :userID }
    }
    else if((fromData && toData) && customer == 'all'){
      query = { date : {$gte: fromData, $lte: toData}, userID :userID}
    }
    else if((fromData && toData) && customer != 'all'){
      query = { date : {$gte: fromData, $lte: toData}, userID :userID, company : customer}
    }
    const datas = await datasService.findAllByQuery(
      query
    );

    let totalPurchase = 0;
    let totalSell = 0;
    datas.forEach((item: any) => {
      item.totalPurchase = 0;
      item.totalSell = 0;
      if (item.purchase.length > 0) {
        item.purchase.forEach((it: any) => {
          item.totalPurchase += it.price;
        })
      }
      if (item.sell.length > 0) {
        item.sell.forEach((it: any) => {
          item.totalSell += it.price;
        })
      }
      totalPurchase += item.totalPurchase;
      totalSell += item.totalSell;
    });

    return res.status(200).send({
      success: true,
      data: {
        datas: datas,
        totalPurchase: totalPurchase,
        totalSell: totalSell
      },
    });
  } catch (error) {
    next(error);
  }
};

const createPurchase = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID, date, name, company, price, update, purchaseId } = req.body;

    // check if the name already exists
    const checkDatas = await datasService.findOneByQuery({
      date,
      company,
      userID
    });

    const authUser = res.locals.user;
    // generate audit trails
    const auditTrails: IAuditTrail = {
      created_at: new Date(),
      created_by: authUser?.email,
      created_detail: `Created ${authUser?.email}`,
    };

    // bind audit trails inside req.body
    req.body.audit_trails = auditTrails;

    let newPurchase ;
    if(!checkDatas){
      newPurchase = await datasService.createOne({
        ...req.body
      });
    }
    else if(purchaseId){
      // console.log(checkDatas.purchase)
      req.body.purchase = checkDatas.purchase.map((obj:any) => {
        if(obj._id.toString() == req.body.purchaseId){
          obj.pricekg = req.body.purchase[0].pricekg;
          obj.amount = req.body.purchase[0].amount;
          obj.price = req.body.purchase[0].price;
        }
        return obj;
      })
      newPurchase = await datasService.updateById(
        checkDatas._id,
        req.body,
        auditTrails
      );
      console.log(purchaseId)
    }
    else{
      console.log('endd')
      if(!update) req.body.purchase = checkDatas.purchase.concat(req.body.purchase)
      newPurchase = await datasService.updateById(
        checkDatas._id,
        req.body,
        auditTrails
      );
    }

    const del = await datasService.deleteMany();

    return res.status(200).send({ success: true, data: newPurchase });
  } catch (error) {
    next(error);
  }
};

const createSell = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userID, date, name, company, price, update } = req.body;

    // check if the name already exists
    const checkDatas = await datasService.findOneByQuery({
      date,
      company,
      userID
    });

    const authUser = res.locals.user;
    // generate audit trails
    const auditTrails: IAuditTrail = {
      created_at: new Date(),
      created_by: authUser?.email,
      created_detail: `Created ${authUser?.email}`,
    };

    // bind audit trails inside req.body
    req.body.audit_trails = auditTrails;
    let newSell ;
    if(!checkDatas){
      newSell = await datasService.createOne({
        ...req.body
      });
    }
    else{
      if(!update) req.body.sell = checkDatas.sell.concat(req.body.sell)
      // req.body.sell = checkDatas.sell.concat(req.body.sell)
      newSell = await datasService.updateById(
        checkDatas._id,
        req.body,
        auditTrails
      );
    }

    const del = await datasService.deleteMany();

    return res.status(200).send({ success: true, data: newSell });
  } catch (error) {
    next(error);
  }
};

export {
  getAllDatas,
  createPurchase,
  createSell,
  filterData
};

