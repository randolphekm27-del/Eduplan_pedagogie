import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { chariowService } from '../services/chariowService';

export default function CheckoutSuccess() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionId = searchParams.get('session_id');
  const checkoutId = searchParams.get('checkout_id') || sessionId;

  useEffect(() => {
    const verifyPayment = async () => {
      if (!checkoutId) {
        setStatus('error');
        setError('Aucune session de paiement trouvée.');
        return;
      }

      try {
        console.log('CheckoutSuccess: verifying payment for session:', checkoutId);

        const orderInfo = await chariowService.getCheckoutStatus(checkoutId);

        console.log('CheckoutSuccess: order status:', orderInfo.status);

        if (orderInfo.status === 'completed') {
          setStatus('success');
          setOrderData(orderInfo);
          toast.success('Paiement confirmé !', {
            description: `Bienvenue ${orderInfo.customer.name}. Votre accès a été activé.`
          });
        } else if (orderInfo.status === 'pending') {
          setTimeout(verifyPayment, 2000);
        } else {
          setStatus('error');
          setError(`Paiement ${orderInfo.status}`);
          toast.error('Erreur de paiement', {
            description: `Statut : ${orderInfo.status}`
          });
        }
      } catch (err) {
        console.error('CheckoutSuccess: verification error:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Échec de la vérification');
        toast.error('Erreur de vérification', {
          description: 'Impossible de vérifier votre paiement.'
        });
      }
    };

    verifyPayment();
  }, [checkoutId]);

  return (
    <div className="min-h-screen bg-edu-light flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 border border-edu-light">
        {status === 'loading' && (
          <div className="text-center space-y-4">
            <Loader2 size={48} className="mx-auto animate-spin text-edu-red" />
            <h1 className="font-serif text-2xl font-bold text-edu-black">
              Vérification...
            </h1>
            <p className="text-edu-black/60">
              Nous vérifions votre paiement. Veuillez patienter.
            </p>
          </div>
        )}

        {status === 'success' && orderData && (
          <div className="text-center space-y-6">
            <CheckCircle size={48} className="mx-auto text-green-500" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-edu-black mb-2">
                Paiement confirmé !
              </h1>
              <p className="text-edu-black/60 mb-4">
                Merci pour votre confiance.
              </p>
            </div>

            <div className="bg-edu-light/50 rounded-lg p-4 text-left space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-edu-black/60">Produit :</span>
                <span className="font-semibold text-edu-black">
                  {orderData.product?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-edu-black/60">Montant :</span>
                <span className="font-semibold text-edu-black">
                  {orderData.amount?.formatted || `${orderData.amount?.value} ${orderData.amount?.currency}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-edu-black/60">Email :</span>
                <span className="font-semibold text-edu-black">
                  {orderData.customer?.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-edu-black/60">Date :</span>
                <span className="font-semibold text-edu-black">
                  {new Date(orderData.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                Votre abonnement est maintenant actif.
              </p>
              <p className="text-sm text-green-900 mt-2">
                Un email de confirmation a été envoyé à {orderData.customer?.email}
              </p>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                to="/dashboard"
                className="w-full py-2 bg-edu-red text-white font-semibold rounded-md hover:bg-edu-black transition-colors flex items-center justify-center gap-2"
              >
                Accéder au tableau de bord
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/"
                className="w-full py-2 bg-edu-light text-edu-black font-semibold rounded-md hover:bg-edu-light/80 transition-colors"
              >
                Revenir à l'accueil
              </Link>
            </div>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-6">
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <div>
              <h1 className="font-serif text-2xl font-bold text-edu-black mb-2">
                Erreur de paiement
              </h1>
              <p className="text-edu-black/60">
                {error || 'Une erreur est survenue lors du traitement de votre paiement.'}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-left text-sm">
              <p className="text-red-900 font-semibold mb-2">
                Que faire ?
              </p>
              <ul className="text-red-900 space-y-1 list-disc list-inside">
                <li>Vérifiez votre connexion internet.</li>
                <li>Contactez le support si le problème persiste.</li>
                <li>Consultez votre email pour les détails du paiement.</li>
              </ul>
            </div>

            <div className="space-y-3 pt-4">
              <Link
                to="/pricing"
                className="w-full py-2 bg-edu-red text-white font-semibold rounded-md hover:bg-edu-black transition-colors"
              >
                Réessayer
              </Link>
              <Link
                to="/contact"
                className="w-full py-2 bg-edu-light text-edu-black font-semibold rounded-md hover:bg-edu-light/80 transition-colors"
              >
                Contacter le support
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
