const express = require('express');

function requireLogin(req, res, next) {
    if (!req.session.user) {
        return res.redirect('/?showLogin=true');
    }
    next();
}

module.exports = { requireLogin };