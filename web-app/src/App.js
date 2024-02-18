import './App.css';
import React, {useState, useEffect} from 'react';
import mqtt from 'mqtt';


function App() {
  const [client, setClient] = useState(null);
  const [connectStatus, setConnectStatus] = useState('Connect');
  const [payload, setPayload] = useState({});
  const cert = `-----BEGIN CERTIFICATE-----
  MIIDWjCCAkKgAwIBAgIVAOtCD3j3hbRJlIvsa8OupGmAmb5aMA0GCSqGSIb3DQEB
  CwUAME0xSzBJBgNVBAsMQkFtYXpvbiBXZWIgU2VydmljZXMgTz1BbWF6b24uY29t
  IEluYy4gTD1TZWF0dGxlIFNUPVdhc2hpbmd0b24gQz1VUzAeFw0yNDAyMTYxNzE0
  NDVaFw00OTEyMzEyMzU5NTlaMB4xHDAaBgNVBAMME0FXUyBJb1QgQ2VydGlmaWNh
  dGUwggEiMA0GCSqGSIb3DQEBAQUAA4IBDwAwggEKAoIBAQCp7w1WLphh0uMRBD7v
  +painDOytE7DGk2mW2kDST8OB+hrChW8FMlBYSIz6dnSJKnYpnc1ySaX3P/n7Nf2
  WX5uNXwTaHJDbjhHvtcrHamNE/8sYis37ITq/JgYDF6ZWpo+sD7q3TTrrU33YP5C
  +2E5TXeD/LT5PxCDKLf5tnM1D2UsMr0bdaISBmYByBgiqupkXcwDPgihalAtwgz/
  yQX00DizdcEzhw6BX5hs87O+INFRNySqBElwST4txhFVHidQ73IZLqvSDJ3muL/d
  oIKTuv7i6umi8ff5ert/juI5+FwV+4ASwl4iWBUdyZ5BoWQS2tK7cdIYHwC845yY
  hsjFAgMBAAGjYDBeMB8GA1UdIwQYMBaAFDYkhm3Rxij8RnUKRjx9CPvdlQrfMB0G
  A1UdDgQWBBStlNXDVmnPmzEvF06lfuciD01JYDAMBgNVHRMBAf8EAjAAMA4GA1Ud
  DwEB/wQEAwIHgDANBgkqhkiG9w0BAQsFAAOCAQEAMwQwNAA/W1qESddWHvhAmfdi
  fXJ8ehZvLi60qYVfiQE6pEhhCutrriYrHKw4SutGCTquKH4ntQL70S5NwjsGAZnz
  +pkK0VYF0t6alpL4Kj2dtGGNFszMHE+IpvVlq/GrWQx3h5RQr8/ziOQirX+7HSDi
  tNEWYMfGCSacEWeKwdXXO5nRiuoxL8PbOEgaf3JedPxnWv9pzmvyarlXmQrNCl5C
  bMqTsM7E+nnRaFM/AvzW4z91g35ard2Q2wjSLMtuA4jJKfblmJGGdlAVQU5JoNt4
  Gq4nlBjPKCUZfsGFgbh5DLsSUpR3887qj8FeTrze9aPj5g2I2OOdhLDES7bqvQ==
  -----END CERTIFICATE-----`;
  const key = `-----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEAqe8NVi6YYdLjEQQ+7/qWopwzsrROwxpNpltpA0k/DgfoawoV
  vBTJQWEiM+nZ0iSp2KZ3Nckml9z/5+zX9ll+bjV8E2hyQ244R77XKx2pjRP/LGIr
  N+yE6vyYGAxemVqaPrA+6t00661N92D+QvthOU13g/y0+T8Qgyi3+bZzNQ9lLDK9
  G3WiEgZmAcgYIqrqZF3MAz4IoWpQLcIM/8kF9NA4s3XBM4cOgV+YbPOzviDRUTck
  qgRJcEk+LcYRVR4nUO9yGS6r0gyd5ri/3aCCk7r+4urpovH3+Xq7f47iOfhcFfuA
  EsJeIlgVHcmeQaFkEtrSu3HSGB8AvOOcmIbIxQIDAQABAoIBAGqAAFq/zw6X7Wjv
  wUYDRb7ZqGjaKfaKmJmm9lRx5kuz1wymgGKkoFESQC5K5BGYmr3F7jZOP5qzjcpb
  nCmvgtYtPPqo3du2yxzj1NQXvfhFzQmS6MUevVrMPcHslqkDqGGbcYMeaZk+vvtH
  1XJDO3Z/P2T/zqfax018Cnk8yE06uCXsCl9uErBBwEm7MPviYjqWfZM7NzptK3qM
  jqoVXtLt79BbiWMHRmO1oLZyOHRlLs3NGi9wMgXOzcnxdK4L0aRQWiSazSB1K1sX
  XBGRyI3bRjTNgerYY6zVg3wki1GPWYRAgPzjVsbXozoHAVKMPGzkjJ0AD8FJFTxp
  /CA0F+0CgYEA2TFeiTWuflNw25Ct7nh4szPjdDqbPGE8fgHhsLUJexF19ALIdQf1
  n5LxL8h6junjU+/qU4MiteSxBzxSpAC/bIKPMHc8RVD6fZHzDVc+qgOJDu5p+gTP
  1GKm2qN4DLqr//p2ICwx5QwZTziM8Q3rnSgRcUE0FEe4y42UwJMjrHcCgYEAyEwA
  +JuyvsItf9lpU8+CeYZ5QeO+YzrsGL2vuX/lJt/oSM1NUfaSmjyr7IWdccAhErsL
  +8Mfa+330N6+pZvR3smNReiYl/W6doqrSbiDejabFZgylc0AjBSsTE2OponlZ+Vu
  vea/0cjphspXTQnwyHyr/WzS8AksxOqaOrozD6MCgYEAi9ij/EkaX7CuXFHeDEx5
  uzlP3UjXJ5ucba4cecE3p4xonIMmO2SynNrqfU/iyh6DB0rVYIxxTxk/e181/u+U
  UfQG6rf7kM5BW5UcIJzqdmHsYDbW+esbPq9+rAzRgbC4iwvj/3c1cTvHGCFbbuL9
  sKVaBchsFhrQPBCflReowqUCgYB6RiuxmRsdaNzt14N9LoiwN29+0dFAMpA+6k2E
  KJdzi+z5xJsXFjeZAMDTux3Ke0e1b4p5PzzHXpaSY+huoRkVsGUV8FB3NAOIqk62
  ynU4/mzeWfNHj8ZtvZERY6dZ84SgUGeydlNTdhtZtdxlo1PikHlOVEjRUEiMTcup
  XlIdkQKBgBSH9Bw0Gv0IGrFs2pn1Qfug16cDvKu1YPU4TKt5WvzstroMybkglu7h
  1g3Wyaxe8mtv64l6s9spFTCUdzpsow9WUAdqPJwhpbx/lDsLXKXANv50YInUz/iC
  8yfoLvxMypc+n4ByGKsyWs0quBK+PQNVzYUEB8gf+cU153CyyBAE
  -----END RSA PRIVATE KEY-----`;
  const rootCA = `-----BEGIN RSA PRIVATE KEY-----
  MIIEowIBAAKCAQEAqe8NVi6YYdLjEQQ+7/qWopwzsrROwxpNpltpA0k/DgfoawoV
  vBTJQWEiM+nZ0iSp2KZ3Nckml9z/5+zX9ll+bjV8E2hyQ244R77XKx2pjRP/LGIr
  N+yE6vyYGAxemVqaPrA+6t00661N92D+QvthOU13g/y0+T8Qgyi3+bZzNQ9lLDK9
  G3WiEgZmAcgYIqrqZF3MAz4IoWpQLcIM/8kF9NA4s3XBM4cOgV+YbPOzviDRUTck
  qgRJcEk+LcYRVR4nUO9yGS6r0gyd5ri/3aCCk7r+4urpovH3+Xq7f47iOfhcFfuA
  EsJeIlgVHcmeQaFkEtrSu3HSGB8AvOOcmIbIxQIDAQABAoIBAGqAAFq/zw6X7Wjv
  wUYDRb7ZqGjaKfaKmJmm9lRx5kuz1wymgGKkoFESQC5K5BGYmr3F7jZOP5qzjcpb
  nCmvgtYtPPqo3du2yxzj1NQXvfhFzQmS6MUevVrMPcHslqkDqGGbcYMeaZk+vvtH
  1XJDO3Z/P2T/zqfax018Cnk8yE06uCXsCl9uErBBwEm7MPviYjqWfZM7NzptK3qM
  jqoVXtLt79BbiWMHRmO1oLZyOHRlLs3NGi9wMgXOzcnxdK4L0aRQWiSazSB1K1sX
  XBGRyI3bRjTNgerYY6zVg3wki1GPWYRAgPzjVsbXozoHAVKMPGzkjJ0AD8FJFTxp
  /CA0F+0CgYEA2TFeiTWuflNw25Ct7nh4szPjdDqbPGE8fgHhsLUJexF19ALIdQf1
  n5LxL8h6junjU+/qU4MiteSxBzxSpAC/bIKPMHc8RVD6fZHzDVc+qgOJDu5p+gTP
  1GKm2qN4DLqr//p2ICwx5QwZTziM8Q3rnSgRcUE0FEe4y42UwJMjrHcCgYEAyEwA
  +JuyvsItf9lpU8+CeYZ5QeO+YzrsGL2vuX/lJt/oSM1NUfaSmjyr7IWdccAhErsL
  +8Mfa+330N6+pZvR3smNReiYl/W6doqrSbiDejabFZgylc0AjBSsTE2OponlZ+Vu
  vea/0cjphspXTQnwyHyr/WzS8AksxOqaOrozD6MCgYEAi9ij/EkaX7CuXFHeDEx5
  uzlP3UjXJ5ucba4cecE3p4xonIMmO2SynNrqfU/iyh6DB0rVYIxxTxk/e181/u+U
  UfQG6rf7kM5BW5UcIJzqdmHsYDbW+esbPq9+rAzRgbC4iwvj/3c1cTvHGCFbbuL9
  sKVaBchsFhrQPBCflReowqUCgYB6RiuxmRsdaNzt14N9LoiwN29+0dFAMpA+6k2E
  KJdzi+z5xJsXFjeZAMDTux3Ke0e1b4p5PzzHXpaSY+huoRkVsGUV8FB3NAOIqk62
  ynU4/mzeWfNHj8ZtvZERY6dZ84SgUGeydlNTdhtZtdxlo1PikHlOVEjRUEiMTcup
  XlIdkQKBgBSH9Bw0Gv0IGrFs2pn1Qfug16cDvKu1YPU4TKt5WvzstroMybkglu7h
  1g3Wyaxe8mtv64l6s9spFTCUdzpsow9WUAdqPJwhpbx/lDsLXKXANv50YInUz/iC
  8yfoLvxMypc+n4ByGKsyWs0quBK+PQNVzYUEB8gf+cU153CyyBAE
  -----END RSA PRIVATE KEY-----`;
  const url = 'wss://a3gozzilrkv83v-ats.iot.us-east-1.amazonaws.com'
  const options = {
    // Clean session
    clean: true,
    connectTimeout: 4000,
    // Authentication
    clientId: 'parcheggio',
    username: 'admin',
    password: 'password',
    ca: rootCA,
    cert: cert,
    key: key
  }
const mqttConnect = (host, mqttOption) => {
  setConnectStatus('Connecting');
  setClient(mqtt.connect(host, mqttOption));
};
useEffect(() => {
  if (client) {
    console.log(client)
    client.on('connect', () => {
      setConnectStatus('Connected');
      console.log('connesso')
    });
    client.on('error', (err) => {
      console.error('Connection error: ', err);
      client.end();
    });
    client.on('reconnect', () => {
      setConnectStatus('Reconnecting');
    });
    client.on('message', (topic, message) => {
      const payload = { topic, message: message.toString() };
      setPayload(payload);
      console.log(payload)
    });
  }
}, [client]);
useEffect(() => {
  mqttConnect(url, options);
  return ()=>{}
}, [])
  return (
    <div className="App">
    </div>
  );
}

export default App;
