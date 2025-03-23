import {
  FaCoins,
  FaBitcoin,
  FaEthereum,
  FaDollarSign,
  FaMoneyBillWave,
  FaDog,
} from 'react-icons/fa';
import { SiDogecoin, SiStellar } from 'react-icons/si';
import { GiCrystalGrowth } from 'react-icons/gi';

export default function getCurrencyInfo(currency: string) {
  switch (currency) {
    case 'BTC':
      return {
        icon: <FaBitcoin className="text-2xl text-amber-500" />,
        name: 'Bitcoin',
        color: 'bg-amber-100',
      };
    case 'ETH':
      return {
        icon: <FaEthereum className="text-2xl text-indigo-400" />,
        name: 'Ethereum',
        color: 'bg-indigo-100',
      };
    case 'USDT':
      return {
        icon: <FaDollarSign className="text-2xl text-green-500" />,
        name: 'Tether',
        color: 'bg-green-100',
      };
    case 'XEM':
      return {
        icon: <GiCrystalGrowth className="text-2xl text-blue-500" />,
        name: 'NEM',
        color: 'bg-blue-100',
      };
    case 'DOGE':
      return {
        icon: <SiDogecoin className="text-2xl text-yellow-500" />,
        name: 'Dogecoin',
        color: 'bg-yellow-100',
      };
    case 'SHIB':
      return {
        icon: <FaDog className="text-2xl text-orange-500" />,
        name: 'Shiba Inu',
        color: 'bg-orange-100',
      };
    case 'XLM':
      return {
        icon: <SiStellar className="text-2xl text-blue-400" />,
        name: 'Stellar',
        color: 'bg-blue-100',
      };
    case 'ARS':
      return {
        icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
        name: 'Peso Argentino',
        color: 'bg-emerald-100',
      };
    case 'CLP':
      return {
        icon: <FaMoneyBillWave className="text-2xl text-green-600" />,
        name: 'Peso Chileno',
        color: 'bg-teal-100',
      };
    default:
      return {
        icon: <FaCoins className="text-2xl text-gray-500" />,
        name: 'Moneda',
        color: 'bg-gray-100',
      };
  }
}
