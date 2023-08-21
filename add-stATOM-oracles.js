// This is generated by writeCoreProposal; please edit!
/* eslint-disable */

const manifestBundleRef = {bundleID:"b1-1c8e93cc80b28b2cf6b1252e9b6edb0253a1f962889f8a255397b43984950a263dd9c9efd82aee5744b46e7bd57ff1c733030e9f4dc8da9b355b185a59687862"};
const getManifestCall = harden([
  "getManifestForPriceFeed",
  {
    AGORIC_INSTANCE_NAME: "STATOM-USD price feed",
    IN_BRAND_DECIMALS: 6,
    IN_BRAND_LOOKUP: [
      "agoricNames",
      "oracleBrand",
      "STATOM",
    ],
    IN_BRAND_NAME: "STATOM",
    OUT_BRAND_DECIMALS: 4,
    OUT_BRAND_LOOKUP: [
      "agoricNames",
      "oracleBrand",
      "USD",
    ],
    OUT_BRAND_NAME: "USD",
    brandInRef: undefined,
    brandOutRef: undefined,
    contractTerms: {
      POLL_INTERVAL: 30n,
      maxSubmissionCount: 1000,
      maxSubmissionValue: 115792089237316195423570985008687907853269984665640564039457584007913129639936n,
      minSubmissionCount: 2,
      minSubmissionValue: 1n,
      restartDelay: 1,
      timeout: 10,
    },
    oracleAddresses: [
      "agoric1ldmtatp24qlllgxmrsjzcpe20fvlkp448zcuce",
      "agoric140dmkrz2e42ergjj7gyvejhzmjzurvqeq82ang",
      "agoric1w8wktaur4zf8qmmtn3n7x3r0jhsjkjntcm3u6h",
      "agoric10vjkvkmpp9e356xeh6qqlhrny2htyzp8hf88fk",
      "agoric1qj07c7vfk3knqdral0sej7fa6eavkdn8vd8etf",
      "agoric1lw4e4aas9q84tq0q92j85rwjjjapf8dmnllnft",
      "agoric1ra0g6crtsy6r3qnpu7ruvm7qd4wjnznyzg5nu4",
      "agoric1zj6vrrrjq4gsyr9lw7dplv4vyejg3p8j2urm82",
      "agoric15xddzse9lq74cyt6ev9d7wywxerenxdgxsdc3m",
      "agoric1w5wmck6q2xrt20ax3njlk2k87m4t4l2y2xgw2d",
    ],
    priceAggregatorRef: {
      bundleID: "b1-8fb229296073327ed26d2a1ac56eda2bdc70c99d68621895a88f6cc09bce2defa3bd0894e97950e5a0696388193279c8f6b9399809611f8fec3ef5aeed355ba5",
    },
  },
]);
const overrideManifest = {
  createPriceFeed: {
    consume: {
      agoricNamesAdmin: "priceFeed",
      board: "priceFeed",
      chainStorage: "priceFeed",
      chainTimerService: "priceFeed",
      client: "priceFeed",
      contractGovernor: "priceFeed",
      econCharterKit: "priceFeed",
      economicCommitteeCreatorFacet: "priceFeed",
      highPrioritySendersManager: "priceFeed",
      namesByAddressAdmin: "priceFeed",
      priceAuthority: "priceFeed",
      priceAuthorityAdmin: "priceFeed",
      startGovernedUpgradable: "priceFeed",
    },
    instance: {
      produce: "priceFeed",
    },
  },
  ensureOracleBrands: {
    namedVat: {
      consume: {
        agoricNames: "agoricNames",
      },
    },
    oracleBrand: {
      produce: "priceFeed",
    },
  },
};

// Make the behavior the completion value.
(({
  manifestBundleRef,
  getManifestCall,
  overrideManifest,
  E,
  log = console.info,
  restoreRef: overrideRestoreRef,
}) => {
  const { entries, fromEntries } = Object;

  // deeplyFulfilled is a bit overkill for what we need.
  const shallowlyFulfilled = async obj => {
    if (!obj) {
      return obj;
    }
    const ents = await Promise.all(
      entries(obj).map(async ([key, valueP]) => {
        const value = await valueP;
        return [key, value];
      }),
    );
    return fromEntries(ents);
  };

  /** @param {ChainBootstrapSpace & BootstrapPowers & { evaluateBundleCap: any }} allPowers */
  const behavior = async allPowers => {
    // NOTE: If updating any of these names extracted from `allPowers`, you must
    // change `permits` above to reflect their accessibility.
    const {
      consume: { vatAdminSvc, zoe, agoricNamesAdmin },
      evaluateBundleCap,
      installation: { produce: produceInstallations },
      modules: {
        utils: { runModuleBehaviors },
      },
    } = allPowers;
    const [exportedGetManifest, ...manifestArgs] = getManifestCall;

    /** @type {(ref: import\('./externalTypes.js').ManifestBundleRef) => Promise<Installation<unknown>>} */
    const defaultRestoreRef = async ref => {
      // extract-proposal.js creates these records, and bundleName is
      // the name under which the bundle was installed into
      // config.bundles
      const p =
        'bundleName' in ref
          ? E(vatAdminSvc).getBundleIDByName(ref.bundleName)
          : ref.bundleID;
      const bundleID = await p;
      const label = bundleID.slice(0, 8);
      return E(zoe).installBundleID(bundleID, label);
    };
    const restoreRef = overrideRestoreRef || defaultRestoreRef;

    // Get the on-chain installation containing the manifest and behaviors.
    console.info('evaluateBundleCap', {
      manifestBundleRef,
      exportedGetManifest,
      vatAdminSvc,
    });
    let bcapP;
    if ('bundleName' in manifestBundleRef) {
      bcapP = E(vatAdminSvc).getNamedBundleCap(manifestBundleRef.bundleName);
    } else {
      bcapP = E(vatAdminSvc).getBundleCap(manifestBundleRef.bundleID);
    }
    const bundleCap = await bcapP;

    const manifestNS = await evaluateBundleCap(bundleCap);

    console.error('execute', {
      exportedGetManifest,
      behaviors: Object.keys(manifestNS),
    });
    const {
      manifest,
      options: rawOptions,
      installations: rawInstallations,
    } = await manifestNS[exportedGetManifest](
      harden({ restoreRef }),
      ...manifestArgs,
    );

    // Await references in the options or installations.
    const [options, installations] = await Promise.all(
      [rawOptions, rawInstallations].map(shallowlyFulfilled),
    );

    // Publish the installations for behavior dependencies.
    const installAdmin = E(agoricNamesAdmin).lookupAdmin('installation');
    await Promise.all(
      entries(installations || {}).map(([key, value]) => {
        produceInstallations[key].resolve(value);
        return E(installAdmin).update(key, value);
      }),
    );

    // Evaluate the manifest for our behaviors.
    return runModuleBehaviors({
      allPowers,
      behaviors: manifestNS,
      manifest: overrideManifest || manifest,
      makeConfig: (name, _permit) => {
        log('coreProposal:', name);
        return { options };
      },
    });
  };

  // Make the behavior the completion value.
  return behavior;
})({ manifestBundleRef, getManifestCall, overrideManifest, E });
