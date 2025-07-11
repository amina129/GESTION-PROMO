import React, { useState } from 'react';
import { User, Building2, ChevronRight, Phone, Mail, Smartphone, Wifi, Shield, Clock } from 'lucide-react';

const HomePage = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Main Hero Section with Animation */}
            <section className="bg-gradient-to-br from-black via-gray-900 to-black text-white py-16 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center">
                        <div className="inline-block bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2 mb-8">
                            <span className="text-orange-400 font-semibold">Bienvenue chez Orange Tunisie</span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                            Votre Connexion,
                            <br />
                            <span className="text-orange-500">Notre Priorité</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
                            Découvrez nos solutions innovantes et choisissez l'expérience qui vous ressemble
                        </p>
                        <div className="flex flex-wrap justify-center gap-6 text-gray-400">
                            <div className="flex items-center">
                                <Wifi className="w-5 h-5 mr-2 text-orange-500" />
                                <span>Réseau 5G</span>
                            </div>
                            <div className="flex items-center">
                                <Shield className="w-5 h-5 mr-2 text-orange-500" />
                                <span>Sécurisé</span>
                            </div>
                            <div className="flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-orange-500" />
                                <span>24/7</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Categories Section Enhanced */}
            <section className="py-16 bg-white relative">
                <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent"></div>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
                            Choisissez votre espace
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Accédez à un univers de services personnalisés selon vos besoins
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Particulier Enhanced */}
                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-2"></div>
                                <div className="p-8 text-center relative">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-orange-100 rounded-full p-2">
                                            <ChevronRight className="w-4 h-4 text-orange-600" />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                                        <User className="w-10 h-10 text-white" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-black mb-4">
                                        Particulier
                                    </h2>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Forfaits mobiles, connexion internet haut débit et smartphones dernière génération
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Smartphone className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Forfaits mobiles illimités</span>
                                        </div>
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Wifi className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Internet très haut débit</span>
                                        </div>
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Shield className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Services sécurisés</span>
                                        </div>
                                    </div>

                                    <div className="bg-black text-white px-6 py-3 rounded-xl group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300 inline-flex items-center shadow-lg">
                                        <span className="font-semibold mr-2">Découvrir</span>
                                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Entreprise Enhanced */}
                        <div className="group cursor-pointer">
                            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-orange-500 transition-all duration-500 hover:shadow-2xl transform hover:-translate-y-2">
                                <div className="bg-gradient-to-r from-black to-gray-800 h-2"></div>
                                <div className="p-8 text-center relative">
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="bg-gray-100 rounded-full p-2">
                                            <ChevronRight className="w-4 h-4 text-gray-600" />
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-br from-black to-gray-800 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                                        <Building2 className="w-10 h-10 text-white" />
                                    </div>

                                    <h2 className="text-2xl font-bold text-black mb-4">
                                        Entreprise
                                    </h2>

                                    <p className="text-gray-600 mb-6 leading-relaxed">
                                        Solutions professionnelles, cloud computing et accompagnement sur mesure
                                    </p>

                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Building2 className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Solutions d'entreprise</span>
                                        </div>
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Shield className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Sécurité avancée</span>
                                        </div>
                                        <div className="flex items-center justify-center text-gray-600">
                                            <Clock className="w-4 h-4 mr-2 text-orange-500" />
                                            <span className="text-sm">Support dédié</span>
                                        </div>
                                    </div>

                                    <div className="bg-black text-white px-6 py-3 rounded-xl group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-orange-600 transition-all duration-300 inline-flex items-center shadow-lg">
                                        <span className="font-semibold mr-2">Découvrir</span>
                                        <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="bg-gray-50 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl font-bold text-black mb-4">
                            Pourquoi choisir Orange ?
                        </h3>
                        <p className="text-gray-600 text-lg">
                            L'excellence technologique au service de votre quotidien
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Wifi className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-lg font-bold text-black mb-3">Réseau 5G</h4>
                            <p className="text-gray-600">La technologie 5G pour une connectivité ultra-rapide et fiable</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-lg font-bold text-black mb-3">Sécurité</h4>
                            <p className="text-gray-600">Protection avancée de vos données et communications</p>
                        </div>

                        <div className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Clock className="w-6 h-6 text-orange-500" />
                            </div>
                            <h4 className="text-lg font-bold text-black mb-3">Support 24/7</h4>
                            <p className="text-gray-600">Assistance technique disponible à tout moment</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-3">
                        Besoin d'aide ?
                    </h3>
                    <p className="text-orange-100 mb-6">
                        Notre équipe est là pour vous accompagner
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-white" />
                            <span className="text-white font-semibold">1200</span>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-white" />
                            <span className="text-white font-semibold">contact@orange.tn</span>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;