const express = require('express');

function requireLogin(req, res, next) {
    if (!req.session.user) return res.redirect('/?showLogin=true');
    next();
}

function requireAdmin(req, res, next) {
  if (req.session.isAdmin) return next();
  return res.redirect(`/${req.session.user.name}/profile?adminOnly=true`);
}

module.exports = { requireLogin, requireAdmin };