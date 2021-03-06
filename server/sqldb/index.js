/**
 * Sequelize initialization module
 */

'use strict';

// import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.Subscription = db.sequelize.import('../api/subscription/subscription.model');
db.Customer = db.sequelize.import('../api/customer/customer.model');
db.Transaction = db.sequelize.import('../api/transaction/transaction.model');
db.Plan = db.sequelize.import('../api/plan/plan.model');
db.FavoriteOpportunity = db.sequelize.import('../api/favorite_opportunity/favorite_opportunity.model');
db.OpportunityApplication = db.sequelize.import('../api/opportunity_application/opportunity_application.model');
db.OpportunityFunction = db.sequelize.import('../api/opportunity_function/opportunity_function.model');
db.ExperienceLevel = db.sequelize.import('../api/experience_level/experience_level.model');
db.Opportunity = db.sequelize.import('../api/opportunity/opportunity.model');
db.OpportunityType = db.sequelize.import('../api/opportunity_type/opportunity_type.model');
db.Year = db.sequelize.import('../api/year/year.model');
db.FormerStudent = db.sequelize.import('../api/former_student/former_student.model');
db.CompanyType = db.sequelize.import('../api/company_type/company_type.model');
db.City = db.sequelize.import('../api/city/city.model');
db.State = db.sequelize.import('../api/state/state.model');
db.Country = db.sequelize.import('../api/country/country.model');
db.Location = db.sequelize.import('../api/location/location.model');
db.Level = db.sequelize.import('../api/level/level.model');
db.Industry = db.sequelize.import('../api/industry/industry.model');
db.Company = db.sequelize.import('../api/company/company.model');
db.Position = db.sequelize.import('../api/position/position.model');
db.NewsCategory = db.sequelize.import('../api/news_category/news_category.model');
db.News = db.sequelize.import('../api/news/news.model');
db.NewsElement = db.sequelize.import('../api/news_element/news_element.model');
db.NewsConstruction = db.sequelize.import('../api/news_construction/news_construction.model');
db.Newsletter = db.sequelize.import('../api/newsletters/newsletter.model');
db.Donation = db.sequelize.import('../api/donation/donation.model');
db.Image = db.sequelize.import('../api/image/image.model');
db.PersonType = db.sequelize.import('../api/person_type/person_type.model');
db.Se = db.sequelize.import('../api/se/se.model');
db.Engineering = db.sequelize.import('../api/engineering/engineering.model');
db.OptionToKnowType = db.sequelize.import('../api/option_to_know_type/option_to_know_type.model');
db.User = db.sequelize.import('../api/user/user.model');
db.Project = db.sequelize.import('../api/project/project.model');
db.ProjectTeam = db.sequelize.import('../api/project_team/project_team.model');
db.ProjectSe = db.sequelize.import('../api/project_se/project_se.model');
db.ProjectCost = db.sequelize.import('../api/project_cost/project_cost.model');
db.ProjectReward = db.sequelize.import('../api/project_reward/project_reward.model');
db.Initiative = db.sequelize.import('../api/initiative/initiative.model');
db.InitiativeLink = db.sequelize.import('../api/initiative_link/initiative_link.model');
db.OpportunitiesLink = db.sequelize.import('../api/opportunities_link/opportunities_link.model');
db.OpportunityTargetPersonType = db.sequelize.import('../api/opportunity_target_person_type/opportunity_target_person_type.model');
db.DonatorHall = db.sequelize.import('../api/donator_hall/donator_hall.model'); 
db.DonatorHallCategory = db.sequelize.import('../api/donator_hall_category/donator_hall_category.model');
 
// Insert relations below
db.User.belongsTo(db.PersonType, {sourceKey: 'PersonTypeId', foreignKey: 'PersonTypeId', as: 'personType'});
db.User.belongsTo(db.Se, {sourceKey: 'SEId', foreignKey: 'ProfessorSEId', as: 'se'});
db.User.belongsTo(db.Engineering, {sourceKey: 'EngineeringId', foreignKey: 'GraduationEngineeringId', as: 'engineering'});
db.User.belongsTo(db.OptionToKnowType, {sourceKey: 'OptionTypeId', foreignKey: 'OptionToKnowThePageId', as: 'optionToKnowType'});
db.User.belongsTo(db.Industry, {sourceKey: 'IndustryId', foreignKey: 'IndustryId', as: 'industry'});
db.User.belongsTo(db.Location, {sourceKey: 'LocationId', foreignKey: 'LocationId', as: 'location'});
db.User.hasMany(db.InitiativeLink, {foreignKey: 'PersonId', as: 'userInitiativeLinks'});
db.User.hasMany(db.OpportunitiesLink, {foreignKey: 'PersonId', as: 'userOpportunitieslinks'})
db.User.hasMany(db.Position, {foreignKey: 'PersonId', as: 'positions'});
db.User.hasMany(db.Image, {foreignKey: 'PersonId', as: 'images'});
db.User.hasMany(db.FormerStudent, {sourceKey: 'FullName', foreignKey: 'Name', as: 'former'});
db.User.hasMany(db.Donation, {sourceKey: 'PersonId', foreignKey: 'DonatorId', as: 'donations'});
db.User.hasMany(db.Opportunity, {foreignKey: 'RecruiterId', as: 'opportunityPosts'});
db.User.hasMany(db.OpportunityApplication, {foreignKey: 'PersonId', as: 'opportunityApplications'});
db.User.hasMany(db.FavoriteOpportunity, {foreignKey: 'PersonId', as: 'favoriteOpportunities'});

db.FormerStudent.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'PersonId', as: 'profile'});
db.FormerStudent.belongsTo(db.Engineering, {sourceKey: 'EngineeringId', foreignKey: 'EngineeringId', as: 'engineering'});

db.InitiativeLink.belongsTo(db.Initiative, {sourceKey: 'InitiativeId', foreignKey: 'InitiativeId', as: 'initiative'});
db.OpportunitiesLink.belongsTo(db.OpportunityType, {sourceKey: 'OpportunityTypeId', foreignKey: 'OpportunityTypeId', as: 'opportunityType'})

db.Project.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'SubmissionerId', as: 'submissioner'});
db.Project.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'LeaderId', as: 'leader'});
db.Project.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'ProfessorId', as: 'professor'});
db.Project.belongsTo(db.Se, {sourceKey: 'SEId', foreignKey: 'ProjectSEId', as: 'se'});
db.Project.hasMany(db.Image, {foreignKey: 'ProjectId', as: 'images'});
db.Project.hasMany(db.Donation, {foreignKey: 'ProjectId', as: 'donations'});
db.Project.hasMany(db.ProjectCost, {foreignKey: 'ProjectId', as: 'costs'});
db.Project.hasMany(db.ProjectReward, {foreignKey: 'ProjectId', as: 'rewards'});


db.ProjectCost.belongsTo(db.Project, {sourceKey: 'ProjectId', foreignKey: 'ProjectId', as: 'project'});
db.ProjectReward.belongsTo(db.Project, {sourceKey: 'ProjectId', foreignKey: 'ProjectId', as: 'project'});

db.News.belongsTo(db.NewsCategory, {sourceKey: 'NewsCategoryId', foreignKey: 'NewsCategoryId', as: 'category'});
db.News.hasMany(db.NewsConstruction, {foreignKey: 'NewsId', as: 'constructions'});

db.NewsConstruction.belongsTo(db.NewsElement, {sourceKey: 'NewsElementId', foreignKey: 'NewsElementId', as: 'element'});
db.NewsConstruction.hasMany(db.Image, {foreignKey: 'NewsConstructionId', as: 'images'});

db.Donation.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'DonatorId', as: 'donator'});
db.Donation.belongsTo(db.FormerStudent, {sourceKey: 'FormerStudentId', foreignKey: 'FormerStudentId', as: 'former'});
db.Donation.belongsTo(db.Project, {sourceKey: 'ProjectId', foreignKey: 'ProjectId', as: 'project'});
db.Donation.belongsTo(db.Transaction, {sourceKey: 'TransactionId', foreignKey: 'TransactionId', as: 'transaction'});
db.Donation.belongsTo(db.OptionToKnowType, {sourceKey: 'OptionTypeId', foreignKey: 'OptionToKnowThePageId', as: 'optionToKnowType'});
db.TransferReceipt = db.Donation.belongsTo(db.Image, {sourceKey: 'ImageId', foreignKey: 'TransferReceiptId', as: 'transferReceipt'});

db.Position.belongsTo(db.Company, {sourceKey: 'CompanyId', foreignKey: 'CompanyId', as: 'company'});
db.Position.belongsTo(db.Level, {sourceKey: 'LevelId', foreignKey: 'LevelId', as: 'level'});
db.Position.belongsTo(db.Location, {sourceKey: 'LocationId', foreignKey: 'LocationId', as: 'location'});

db.Company.belongsTo(db.Industry, {sourceKey: 'IndustryId', foreignKey: 'IndustryId', as: 'industry'});

db.Location.belongsTo(db.Country, {sourceKey: 'CountryId', foreignKey: 'CountryId', as: 'country'});
db.Location.belongsTo(db.State, {sourceKey: 'StateId', foreignKey: 'StateId', as: 'state'});
db.Location.belongsTo(db.City, {sourceKey: 'CityId', foreignKey: 'CityId', as: 'city'});

db.State.belongsTo(db.Country, {sourceKey: 'CountryId', foreignKey: 'CountryId', as: 'country'});

db.City.belongsTo(db.State, {sourceKey: 'StateId', foreignKey: 'StateId', as: 'state'});

db.Year.hasMany(db.FormerStudent, {foreignKey: 'GraduationYear', as: 'formers'});

db.Customer.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'PersonId', as: 'donator'});

db.Subscription.belongsTo(db.Plan, {sourceKey: 'PlanId', foreignKey: 'PlanId', as: 'plan'});
db.Subscription.belongsTo(db.Customer, {sourceKey: 'CustomerId', foreignKey: 'CustomerId', as: 'customer'});
db.Subscription.belongsTo(db.Project, {sourceKey: 'ProjectId', foreignKey: 'ProjectId', as: 'project'});
db.Subscription.hasMany(db.Transaction, {foreignKey: 'SubscriptionId', as: 'transactions'});

db.Transaction.belongsTo(db.Customer, {sourceKey: 'CustomerId', foreignKey: 'CustomerId', as: 'customer'});
db.Transaction.belongsTo(db.Subscription, {sourceKey: 'SubscriptionId', foreignKey: 'SubscriptionId', as: 'subscription'});

db.Opportunity.belongsTo(db.OpportunityType, {sourceKey: 'OpportunityTypeId', foreignKey: 'OpportunityTypeId', as: 'opportunityType'});
db.Opportunity.belongsTo(db.OpportunityFunction, {sourceKey: 'OpportunityFunctionId', foreignKey: 'OpportunityFunctionId', as: 'opportunityFunction'});
db.Opportunity.belongsTo(db.ExperienceLevel, {sourceKey: 'ExperienceLevelId', foreignKey: 'ExperienceLevelId', as: 'experienceLevel'});
db.Opportunity.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'RecruiterId', as: 'recruiter'});
db.Opportunity.belongsTo(db.Company, {sourceKey: 'CompanyId', foreignKey: 'CompanyId', as: 'company'});
db.Opportunity.belongsTo(db.Location, {sourceKey: 'LocationId', foreignKey: 'LocationId', as: 'location'});
db.Opportunity.belongsTo(db.Image, {sourceKey: 'ImageId', foreignKey: 'ImageId', as: 'companyLogo'});
db.Opportunity.hasMany(db.OpportunityApplication, {foreignKey: 'OpportunityId', as: 'opportunityApplications'});
db.Opportunity.hasMany(db.OpportunityTargetPersonType, {foreignKey: 'OpportunityId', as: 'opportunityTargets'});
 
db.OpportunityApplication.belongsTo(db.Opportunity, {sourceKey: 'OpportunityId', foreignKey: 'OpportunityId', as: 'opportunity'});
db.OpportunityApplication.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'PersonId', as: 'user'});
db.Resume = db.OpportunityApplication.belongsTo(db.Image, {sourceKey: 'ImageId', foreignKey: 'ResumeId', as: 'resume'});

db.FavoriteOpportunity.belongsTo(db.Opportunity, {sourceKey: 'OpportunityId', foreignKey: 'OpportunityId', as: 'opportunity'});

db.DonatorHall.belongsTo(db.PersonType, {sourceKey: 'PersonTypeId', foreignKey: 'PersonTypeId', as: 'personType'});
db.DonatorHall.belongsTo(db.User, {sourceKey: 'PersonId', foreignKey: 'DonatorId', as: 'donator'});
db.DonatorHall.belongsTo(db.FormerStudent, {sourceKey: 'FormerStudentId', foreignKey: 'FormerStudentId', as: 'formerStudent'});
db.DonatorHall.belongsTo(db.DonatorHallCategory, {sourceKey: 'DonatorHallCategoryId', foreignKey: 'CategoryId', as: 'category'})
module.exports = db;
