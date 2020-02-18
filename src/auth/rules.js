const db = require('../context/db').db
const helper = require('../context/db').helper

// rules 
// takes in standard graphql middleware params as input and returns a boolean value

const isAllowedToEdit =  (src, args, ctx, info) => {
    const policyNo = args.policyNo
    const amount = args.amount
    const user = ctx.user.name
    console.log("debug")
    if (
        helper.isValidPolicy(policyNo) &&
        db.users[user].role === 'broker' &&
        helper.findPolicyByPolicyNo(policyNo).brokers.some((broker) => {
            return broker.name === user
        }) &&
        helper.findPolicyByPolicyNo(policyNo).brokers.find((broker) => {
            return broker.name === user
        }).brokerCanEdit) {
        console.log("isAllowedToEdit: " + (amount < db.brokerInfo[user].allowedEditLimit).toString())
        return amount < db.brokerInfo[user].allowedEditLimit
    } else if (
        helper.isValidPolicy(policyNo) &&
        db.users[user].role === 'sub-broker' &&
        helper.findPolicyByPolicyNo(policyNo).brokers.some((broker) => {
            return broker.name === helper.findMyBoss(user)
        }) &&
        helper.findPolicyByPolicyNo(policyNo).brokers.find((broker) => {
            return broker.name === helper.findMyBoss(user)
        }).brokerCanEdit) {
        console.log("isAllowedToEdit: " + (amount < db.brokerInfo[user].allowedEditLimit).toString())
        return amount < db.brokerInfo[user].allowedEditLimit
    } else {
        console.log("isAllowedToEdit: false")
        return false
    }
}

const isAllowedToWithdraw =  (src, args, ctx, info) => {
    const policyNo = args.policyNo
    const amount = args.amount
    const user = ctx.user.name
    console.log("debug")

    if (
        helper.isValidPolicy(policyNo) &&
        db.users[user].role === 'broker' &&
        helper.findPolicyByPolicyNo(policyNo).brokers.some(broker => broker.name === user) &&
        helper.findPolicyByPolicyNo(policyNo).brokers.find(broker => broker.name === user).brokerCanWithdraw) {
        console.log("isAllowedToWithdraw: " + (amount < db.brokerInfo[user].allowedWithdrawLimit).toString())
        return amount < db.brokerInfo[user].allowedWithdrawLimit
    } else if (
        helper.isValidPolicy(policyNo) &&
        db.users[user].role === 'sub-broker' &&
        helper.findPolicyByPolicyNo(policyNo).brokers.some(broker => broker.name === helper.findMyBoss(user)) &&
        helper.findPolicyByPolicyNo(policyNo).brokers.find(broker => broker.name === helper.findMyBoss(user)).brokerCanWithdraw) {
        console.log("isAllowedToWithdraw: " + (amount < db.brokerInfo[user].allowedWithdrawLimit).toString())
        return amount < db.brokerInfo[user].allowedWithdrawLimit
    } else {
        console.log("isAllowedToEdit: false")
        return false
    }
}

const isAuthenticated =  (src, args, ctx, info) => {
    console.log("isAuthenticated: " + (db.users[ctx.user.name] !== null).toString())
    return db.users[ctx.user.name] !== null
}

const isAdmin =  (src, args, ctx, info) => {
    console.log("isAdmin: " + (ctx.user.role === 'admin').toString())
    return ctx.user.role === 'admin'
}

const isBroker =  (src, args, ctx, info) => {
    console.log("isBroker: " + (ctx.user.role === 'broker').toString())
    return ctx.user.role === 'broker'
}


const isSubBroker =  (src, args, ctx, info) => {
    console.log("isSubBroker: " + (ctx.user.role === 'sub-broker').toString())
    return ctx.user.role === 'sub-broker'
}


const isInvestor =  (src, args, ctx, info) => {
    console.log("isInvestor: " + (ctx.user.role === 'investor').toString())
    return ctx.user.role === 'investor'
}


export {
    isAdmin,
    isBroker,
    isSubBroker,
    isInvestor,
    isAllowedToEdit,
    isAllowedToWithdraw,
    isAuthenticated,
}